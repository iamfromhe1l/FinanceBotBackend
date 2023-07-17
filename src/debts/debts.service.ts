import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { DebtsModel } from './debts.model';
import { AddDebtsDto } from './dto/add.debts.dto';
import { RemoveDebtsDto } from './dto/remove.debts.dto';
import { UserService } from '../user/user.service';
import { EditDebtsDto } from './dto/edit.debts.dto';
import { CloseDebtsDto } from './dto/close.debts.dto';
import { ObjectId } from 'mongoose';
import { debt } from './debts.type';
import {debtsExceptions} from "../common/exceptions/exception.constants";
import {ServiceException} from "../common/exceptions/serviceException";

@Injectable()
export class DebtsService {
	constructor(
		@InjectModel(DebtsModel)
		private readonly debtsModel: ReturnModelType<typeof DebtsModel>,
		private readonly userService: UserService,
	) {}

	async getDebt(email: string, name: string, debtType: debt){
		return this.debtsModel
			.findOne({ name, email, type: debtType })
			.exec();
	}

	async getDebtById(id: ObjectId) {
		return this.debtsModel.findById(id);
	}

	async addDebt(email: string, dto: AddDebtsDto,): Promise<DebtsModel> {
		const debt = await this.getDebt(email, dto.name, dto.debtType);
		if (debt) {
			const amount = debt.listDebts.get(dto.currency);
			debt.listDebts.set(dto.currency,amount + dto.amount);
			await debt.save;
			return debt;
		}
		const newDebt = new this.debtsModel({
			email,
			name: dto.name,
			amount: dto.amount,
			debtDate: Date.now(),
			type: dto.debtType,
			editBalance: dto.editBalance,
			currency: dto.currency
		});
		const user = await this.userService.findUser(email);
		user.debts = [...user.debts, newDebt.id];
		await user.save();
		return await newDebt.save();
	}

	

	// async checkExistance(){
	//
	// }

	async deleteDebt(email: string, dto: RemoveDebtsDto): Promise<DebtsModel> {
		const debt = await this.getDebt(email, dto.name, dto.debtType);
		if (!debt) throw new ServiceException(debtsExceptions.DEBT_NOT_EXIST);
		const user = await this.userService.findUser(email);
		user.debts.splice(user.debts.indexOf(debt.id));
		await user.save();
		return await debt.deleteOne();
	}
	async deleteDebtById(
		email: string,
		id: ObjectId,
	): Promise<DebtsModel | number> {
		const debt = await this.getDebtById(id);
		if (!debt || debt.email != email) return -1;
		const user = await this.userService.findUser(email);
		user.debts.splice(user.debts.indexOf(debt.id));
		await user.save();
		return await debt.deleteOne();
	}



	async editDebt(
		email: string,
		dto: EditDebtsDto,
	): Promise<DebtsModel | number> {
		const debt = await this.getDebt(email, dto.name, dto.debtType);
		if (!debt || !dto.editedAmount) return -1;
		debt.amount = dto.editedAmount;
		return await debt.save();
	}

	async editDebtById(
		email: string,
		id: ObjectId,
		editedAmount: number,
	): Promise<DebtsModel | number> {
		const debt = await this.getDebtById(id);
		if (!debt || debt.email != email || !editedAmount) return -1;
		debt.amount = editedAmount;
		return await debt.save();
	}

	async getDebtsList(email: string, debtType: debt): Promise<DebtsModel[]> {
		const user = await this.userService.getUserWithPopulate(email);
		return user.debts.filter((el) => el.type == debtType);
	}

	async getRangedDebtsList(
		email: string,
		deptType: debt,
		step = 10,
		current = 0,
	): Promise<DebtsModel[]> {
		return this.debtsModel
			.find({ email, type: deptType })
			.limit((current + 1) * step)
			.skip(current * step);
	}

	async getTotalDebts(email: string, debtType: debt): Promise<number> {
		const debtsList = await this.getDebtsList(email, debtType);
		return debtsList.map((el) => el.amount).reduce((acc, el) => acc + el, 0);
	}

	async closeDebt(
		email: string,
		dto: CloseDebtsDto,
	): Promise<DebtsModel | number> {
		const debt = await this.getDebtById(dto.id);
		if (!debt || debt.email != email) return -1;
		debt.isClosed = true;
		return debt.save();
	}
	
}
