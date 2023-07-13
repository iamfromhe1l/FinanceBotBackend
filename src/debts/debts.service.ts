import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { DebtsModel } from './debts.model';
import { AddDebtsDto } from './dto/add.debts.dto';
import { RemoveDebtsDto } from './dto/remove.debts.dto';
import { UserService } from '../user/user.service';
import { EditDebtsDto } from './dto/edit.debts.dto';
import { UserModel } from '../user/user.model';
import { CloseDebtsDto } from './dto/close.debts.dto';

@Injectable()
export class DebtsService {
	constructor(
		@InjectModel(DebtsModel)
		private readonly debtsModel: ReturnModelType<typeof DebtsModel>,
		private readonly userService: UserService,
	) {}

	async getDebt(email, name) {
		return await this.debtsModel
			.findOne({ name: name, email: email })
			.exec();
	}

	async addDebt(
		email: string,
		dto: AddDebtsDto,
	): Promise<DebtsModel | UserModel> {
		const debt = await this.getDebt(email, dto.name);
		if (debt) {
			debt.amount += dto.amount;
			await debt.save();
			return debt;
		}
		const newDebt = new this.debtsModel({
			email,
			name: dto.name,
			amount: dto.amount,
			debtDate: Date.now(),
		});
		await newDebt.save();
		const user = await this.userService.findUser(email);
		user.debts = [...user.debts, newDebt.id];
		await user.save();
		return user;
	}

	async deleteDebt(
		email: string,
		dto: RemoveDebtsDto,
	): Promise<DebtsModel | number> {
		const debt = await this.getDebt(email, dto.name);
		if (!debt) return -1;
		const user = await this.userService.findUser(email);
		user.debts.splice(user.debts.indexOf(debt.id));
		await user.save();
		await debt.deleteOne();
		await debt.save;
		return debt;
	}

	async editDebt(
		email: string,
		dto: EditDebtsDto,
	): Promise<DebtsModel | number> {
		const debt = await this.getDebt(email, dto.name);
		if (!debt) return -1;
		debt.amount = dto.editedAmount;
		await debt.save();
		return debt;
	}

	async getDebtsList(email: string): Promise<DebtsModel[]> {
		const user = await this.userService.getUserWithPopulate(email);
		return user['debtsToMe'];
	}

	async getRangedDebtsList(
		email: string,
		step = 10,
		current = 0,
	): Promise<DebtsModel[]> {
		return this.debtsModel
			.find({ email })
			.limit((current + 1) * step)
			.skip(current * step);
	}

	async getTotalDebts(email: string): Promise<number> {
		const debtsList = await this.getDebtsList(email);
		return debtsList.map((el) => el.amount).reduce((acc, el) => acc + el, 0);
	}

	async closeDebt(email: string, dto: CloseDebtsDto) {
		const id = dto.id;
		await this.debtsModel.updateOne(
			{ _id:id},
			{  $set: { isClosed: true} },
		);
	}
}
