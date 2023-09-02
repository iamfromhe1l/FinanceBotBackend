import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { DebtsModel } from './debts.model';
import { AddDebtsDto } from './dto/add.debts.dto';
import { UserService } from '../user/user.service';
import { CloseDebtsDto } from './dto/close.debts.dto';
import {Types} from 'mongoose';
import { debtHolderType } from "./debts.type";
import {debtsExceptions} from "../common/exceptions/exception.constants";
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


	async getDebt(email: string, name: string, debtType: debtHolderType, currency: availableCurrency){
		return this.debtsModel.findOne({ name, email, type: debtType, "value.currencyName": currency}).exec();
	}


	// TODO Посмотреть что будет если не существует долга
	async getDebtById(id: Types.ObjectId) {
		return this.debtsModel.findById(id).exec();
	}

	/*
	Открытие долга мне   balance -
	Открытие долга моего balance +
	Закрытие долга мне   balance +
	Закрытие долга моего balance -
	*/
	async editBalanceByDebt(type:debtHolderType, opening:boolean, email: string, amount: number): Promise<void>{
		const operation = type=="my" && opening || type=="me" && !opening;
		const sign = operation ? 1 : -1;
		await this.balanceService.diffBalance(email,{
			diff:amount*sign,
			currencyName:"RUS"
		});
	}

	async addDebt(email: string, dto: AddDebtsDto,): Promise<DebtsModel> {
		const debt = await this.getDebt(email, dto.name, dto.debtType, dto.currency);
		if (dto.editBalance)
			await this.editBalanceByDebt(dto.debtType,true,email,dto.amount);
		if (debt)
			return await this.diffDebt(email,{diff:dto.amount,id:debt._id});
		const fixedCurrencies = new Map<availableCurrency,number>;
		if (dto.isFixed){
			const actualCurrencies = await this.balanceService.getCurrencies();
			fixedCurrencies.set(dto.currency,actualCurrencies.get(dto.currency));
		}
		const newDebt = new this.debtsModel({
			email,
			...dto,
			debtDate: Date.now(),
			fixedCurrencies
		});
		await this.userService.pushToNestedArray(email,newDebt._id,"debts");
		return await newDebt.save();
	}

	async deleteDebt(email: string, id: Types.ObjectId,): Promise<DebtsModel> {
		const debt = await this.getDebtById(id);
		if (!debt || debt.email != email) throw new ServiceException(debtsExceptions.DEBT_NOT_EXIST);
		await this.userService.popFromNestedArray(email,debt._id,"debts");
		return debt.deleteOne();
	}

	async editDebt(email: string, dto: EditDebtsDto): Promise<DebtsModel> {
		const debt = await this.getDebtById(dto.id);
		//TODO вынести проверку email в каждом запросе в интерсептор
		if (!debt || debt.email != email) throw new ServiceException(debtsExceptions.DEBT_NOT_EXIST);
		debt.value.amount = dto.editedAmount;
		return await debt.save();
	}

	async diffDebt(email: string, dto: DiffDebtsDto): Promise<DebtsModel> {
		const debt = await this.getDebtById(dto.id);
		if (!debt || debt.email != email) throw new ServiceException(debtsExceptions.DEBT_NOT_EXIST);
		debt.value.amount += dto.diff;
		return await debt.save();
	}

	async getDebtsList(email: string, debtType: debtHolderType): Promise<DebtsModel[]> {
		const user = await this.userService.getUserWithDebtsPopulate(email);
		return user.debts.filter((el) => el.type == debtType);
	}

	async getRangedDebtsList(email: string, deptType: debtHolderType, step = 10, current = 0,): Promise<DebtsModel[]> {
		return this.debtsModel
			.find({ email, type: deptType })
			.limit((current + 1) * step)
			.skip(current * step);
	}

	async closeDebt(email: string, dto: CloseDebtsDto): Promise<DebtsModel> {
		const debt = await this.getDebtById(dto.id);
		if (!debt || debt.email != email) throw new ServiceException(debtsExceptions.DEBT_NOT_EXIST);
		if (debt.editBalance)
			await this.editBalanceByDebt(debt.type,false,email,debt.value.amount);
		debt.isClosed = true;
		return debt.save();
	}

	async getReducedDebtsMap(email: string, debtType: debtHolderType): Promise<Map<availableCurrency,number>>{
		const debtsList = await this.getDebtsList(email, debtType);
		const TotalDebtsMap = new Map<availableCurrency,number>;
		debtsList.map(el => {
			TotalDebtsMap.set(el.value.currencyName,el.value.amount + TotalDebtsMap.get(el.value.currencyName));
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
