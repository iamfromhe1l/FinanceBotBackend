import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { MyDebtsModel } from './myDebts.model';
import { AddMyDebtsDto } from './dto/add.myDebts.dto';
import { RemoveMyDebtsDto } from './dto/remove.myDebts.dto';
import { UserService } from '../user/user.service';
import { EditMyDebtsDto } from './dto/edit.myDebts.dto';
import { UserModel } from '../user/user.model';

@Injectable()
export class MyDebtsService {
	constructor(
		@InjectModel(MyDebtsModel)
		private readonly myDebtsModel: ReturnModelType<typeof MyDebtsModel>,
		private readonly userService: UserService,
	) {}

	async getDebt(email, name) {
		return await this.myDebtsModel.findOne({ name: name, email: email }).exec();
	}

	async addMyDebt(
		email: string,
		dto: AddMyDebtsDto,
	): Promise<MyDebtsModel | UserModel> {
		const debt = await this.getDebt(email, dto.name);
		if (debt) {
			debt.amount += dto.amount;
			await debt.save();
			return debt;
		}
		const newDebt = new this.myDebtsModel({
			email,
			name: dto.name,
			amount: dto.amount,
			debtDate: Date.now(),
		});
		await newDebt.save();
		const user = await this.userService.findUser(email);
		user.myDebts = [...user.myDebts, newDebt.id];
		await user.save();
		return user;
	}

	async deleteMyDebt(
		email: string,
		dto: RemoveMyDebtsDto,
	): Promise<MyDebtsModel | number> {
		const debt = await this.getDebt(email, dto.name);
		if (!debt) return -1;
		const user = await this.userService.findUser(email);
		user.myDebts.splice(user.myDebts.indexOf(debt.id));
		await user.save();
		await debt.deleteOne();
		await debt.save;
		return debt;
	}

	async getRangedDebtsList(
		email: string,
		step = 10,
		current = 0,
	): Promise<MyDebtsModel[]> {
		return await this.myDebtsModel
			.find({ email })
			.limit((current + 1) * step)
			.skip(current * step);
	}

	async editMyDebt(
		email: string,
		dto: EditMyDebtsDto,
	): Promise<MyDebtsModel | number> {
		const debt = await this.getDebt(email, dto.name);
		if (!debt) return -1;
		debt.amount = dto.editedAmount;
		await debt.save();
		return debt;
	}

	async getDebtsList(email: string): Promise<MyDebtsModel[]> {
		const user = await this.userService.getUserWithPopulate(email);
		return user['myDebts'];
	}

	async getTotalDebts(email: string): Promise<number> {
		const debtsList = await this.getDebtsList(email);
		return debtsList.map((el) => el.amount).reduce((acc, el) => acc + el, 0);
	}
}
