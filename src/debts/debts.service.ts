import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { DebtsModel } from './debts.model';
import { AddDebtsDto } from './dto/add.debts.dto';
import { UserService } from '../user/user.service';
import { CloseDebtsDto } from './dto/close.debts.dto';
import {Types} from 'mongoose';
import { debtType } from './debts.type';
import {debtsExceptions} from "../common/exceptions/exception.constants";
import {ServiceException} from "../common/exceptions/serviceException";
import {availableCurrency} from "../balance/balance.types";
import {BalanceService} from "../balance/balance.service";
import {EditDebtsDto} from "./dto/edit.debts.dto";

@Injectable()
export class DebtsService {
	constructor(
		@InjectModel(DebtsModel)
		private readonly debtsModel: ReturnModelType<typeof DebtsModel>,
		private readonly userService: UserService,
		private readonly balanceService: BalanceService,
	) {}

	//зач тут exec()
	async getDebt(email: string, name: string, debtType: debtType){
		return this.debtsModel
			.findOne({ name, email, type: debtType })
			.exec();
	}

	async getDebtById(id: Types.ObjectId) {
		return this.debtsModel.findById(id);
	}



	// Открытие долга мне   balance -
	// Открытие долга моего balance +
	// Закрытие долга мне   balance +
	// Закрытие долга моего balance -
	async editBalanceByDebt(type:debtType, opening:boolean, email, amount): Promise<void>{
		const operation = type=="my" && opening || type=="me" && !opening;
		const sign = operation ? 1 : -1;
		await this.balanceService.diffBalance(email,{
			diff:amount*sign,
			currencyName:"RUS"
		});
	}

	// мб сделать чтобы человекк не мог добавить долг, если уже есть долг этому человеку.
	// нужно чтобы он мог только diffBalance
	async addDebt(email: string, dto: AddDebtsDto,): Promise<DebtsModel> {
		const debt = await this.getDebt(email, dto.name, dto.debtType);
		if (dto.editBalance)
			await this.editBalanceByDebt(dto.debtType,true,email,dto.amount);
		if (debt)
			return await this.editDebt(email,debt._id,{editedAmount:dto.amount,currency:dto.currency});

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
		const user = await this.userService.findUser(email);

		//TODO мб следующую строчку лучше делать через юзерСервис и монгусовские методы
		user.debts = [...user.debts, newDebt.id];
		await user.save();
		return await newDebt.save();
	}

	async deleteDebt(email: string, id: Types.ObjectId,): Promise<DebtsModel> {
		const debt = await this.getDebtById(id);
		if (!debt || debt.email != email) throw new ServiceException(debtsExceptions.DEBT_NOT_EXIST);
		const user = await this.userService.findUser(email);
		user.debts.splice(user.debts.indexOf(debt.id));
		await user.save();
		return debt.deleteOne();
	}

	async editDebt(email: string, dto: EditDebtsDto): Promise<DebtsModel> {
		const debt = await this.getDebtById(dto.id);
		//TODO вынести проверку email в каждом запросе в отдельную функцию
		if (!debt || debt.email != email) throw new ServiceException(debtsExceptions.DEBT_NOT_EXIST);
		//Создать метод для добавления новых currencies;
		debt.listDebts.set(dto.currency,dto.editedAmount);
		return await debt.save();
	}

	async getDebtsList(email: string, debtType: debtType): Promise<DebtsModel[]> {
		const user = await this.userService.getUserWithPopulate(email);
		return user.debts.filter((el) => el.type == debtType);
	}

	async getRangedDebtsList(
		email: string,
		deptType: debtType,
		step = 10,
		current = 0,
	): Promise<DebtsModel[]> {
		return this.debtsModel
			.find({ email, type: deptType })
			.limit((current + 1) * step)
			.skip(current * step);
	}

	async getReducedDebtsMap(email: string, debtType: debtType): Promise<Map<availableCurrency,number>>{
		const debtsList = await this.getDebtsList(email, debtType);
		const TotalDebtsMap = new Map<availableCurrency,number>;
		debtsList.map(el => {
			el.listDebts.forEach((value,key) => {
				TotalDebtsMap.set(key,value + TotalDebtsMap.get(key));
			});
		});
		return TotalDebtsMap;
	}

	async getReducedDebts(email: string, debtType: debtType): Promise<number>{
		const debtsList = await this.getDebtsList(email, debtType);
		let totalDebts = 0;
		const currencies = await this.balanceService.getCurrencies();
		debtsList.map(el => {
			el.listDebts.forEach((value,key) => {
				totalDebts += value / currencies.get(key);
			});
		});
		return totalDebts;
	}

	async closeDebt(email: string, dto: CloseDebtsDto): Promise<DebtsModel> {
		const debt = await this.getDebtById(dto.id);
		if (!debt || debt.email != email) throw new ServiceException(debtsExceptions.DEBT_NOT_EXIST);
		debt.isClosed = true;
		return debt.save();
	}
	
}
