import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { DebtsModel } from './debts.model';
import { AddDebtsDto } from './dto/add.debts.dto';
import { UserService } from '../user/user.service';
import { CloseDebtsDto } from './dto/close.debts.dto';
import {Types} from 'mongoose';
import { debtHolderType } from "./debts.type";
import { commonExceptions, debtsExceptions } from "../common/exceptions/exception.constants";
import {ServiceException} from "../common/exceptions/serviceException";
import {availableCurrency} from "../balance/balance.types";
import {BalanceService} from "../balance/balance.service";
import {EditDebtsDto} from "./dto/edit.debts.dto";
import { DiffDebtsDto } from "./dto/diff.debts.dto";

@Injectable()
export class DebtsService {
	constructor(
		@InjectModel(DebtsModel)
		private readonly debtsModel: ReturnModelType<typeof DebtsModel>,
		private readonly userService: UserService,
		private readonly balanceService: BalanceService,
	) {}

	// TODO проверить работает ли метод и вообще нужен ли он
	async getDebt(email: string, name: string, debtType: debtHolderType, currency: availableCurrency){
		return this.debtsModel.findOne({ name, email, type: debtType, "value.currency": currency}).exec();
	}

	async getDebtById(id: Types.ObjectId, email: string){
		const debt = await this.debtsModel.findById(id).exec()
		if (!debt) throw new ServiceException(debtsExceptions.DEBT_NOT_EXIST);
		if (debt.email != email) throw new ServiceException(commonExceptions.AUTHORIZATION_ERROR);
		return debt
	}

	async editBalanceByDebt(type:debtHolderType, opening:boolean, email: string, amount: number, currency: availableCurrency): Promise<void>{
		const operation = type=="my" && opening || type=="me" && !opening;
		const sign = operation ? 1 : -1;
		const currencies = await this.balanceService.getCurrencies();
		await this.balanceService.diffBalance(email,{
			diff:amount * sign * currencies.get(currency),
			currency:"RUB"
		});
	}

	async addDebt(email: string, dto: AddDebtsDto,): Promise<DebtsModel> {
		const debt = await this.getDebt(email, dto.name, dto.type, dto.value.currency);
		if (dto.editBalance)
			await this.editBalanceByDebt(dto.type,true,email,dto.value.amount,dto.value.currency);
		if (debt)
			return await this.diffDebt(email,{diff:dto.value.amount,id:debt._id});
		const oldValue = {};
		if (dto.isFixed){
			const actualCurrencies = await this.balanceService.getCurrencies();
			oldValue["amount"] = dto.value.amount * actualCurrencies.get(dto.value.currency);
			oldValue["currency"] = "RUB";
		}
		const newDebt = new this.debtsModel({
			email,
			...dto,
			oldValue
		});
		await this.userService.pushToNestedArray(email,newDebt._id,"debts");
		return await newDebt.save();
	}

	async deleteDebt(email: string, id: Types.ObjectId,): Promise<DebtsModel> {
		const debt = await this.getDebtById(id, email);
		await this.userService.popFromNestedArray(email,debt._id,"debts");
		return debt.deleteOne();
	}

	async editDebt(email: string, dto: EditDebtsDto): Promise<DebtsModel> {
		const debt = await this.getDebtById(dto.id, email);
		debt.value.amount = dto.editedAmount;
		return await debt.save();
	}

	async diffDebt(email: string, dto: DiffDebtsDto): Promise<DebtsModel> {
		const debt = await this.getDebtById(dto.id, email);
		debt.value.amount += dto.diff;
		return await debt.save();
	}

	async getDebtsList(email: string, debtType: debtHolderType): Promise<DebtsModel[]> {
		return this.debtsModel.find({ email, $eq :{type: debtType}});
	}

	async getRangedDebtsList(email: string, deptType: debtHolderType, step = 10, current = 0,): Promise<DebtsModel[]> {
		return this.debtsModel
			.find({ email, type: deptType })
			.limit((current + 1) * step)
			.skip(current * step);
	}

	async closeDebt(email: string, dto: CloseDebtsDto): Promise<DebtsModel> {
		const debt = await this.getDebtById(dto.id, email);
		const value = debt.isFixed ? debt.oldValue : debt.value;
		if (debt.editBalance)
			await this.editBalanceByDebt(debt.type,false,email,value.amount, value.currency);
		debt.isClosed = true;
		return debt.save();
	}

	async getReducedDebtsMap(email: string, debtType: debtHolderType): Promise<Map<availableCurrency,number>>{
		const debtsList = await this.getDebtsList(email, debtType);
		const TotalDebtsMap = new Map<availableCurrency,number>;
		debtsList.map(el => {
			TotalDebtsMap.set(el.value.currency,el.value.amount + TotalDebtsMap.get(el.value.currency));
		});
		return TotalDebtsMap;
	}

	async getReducedDebts(email: string, debtType: debtHolderType): Promise<number>{
		const debtsList = await this.getReducedDebtsMap(email, debtType);
		let totalDebts = 0;
		const currencies = await this.balanceService.getCurrencies();
		debtsList.forEach((value,key) => {
			totalDebts += value / currencies.get(key);
		});
		return totalDebts;
	}
	
}
