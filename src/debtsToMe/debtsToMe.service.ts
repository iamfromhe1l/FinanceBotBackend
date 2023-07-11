import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { DebtsToMeModel } from './debtsToMe.model';
import { AddDebtsToMeDto } from './dto/add.debtsToMe.dto';
import { RemoveDebtsToMeDto } from './dto/remove.debtsToMe.dto';
import { UserService } from '../user/user.service';
import { EditDebtsToMeDto } from './dto/edit.debtsToMe.dto';
import { UserModel } from '../user/user.model';
import { CloseDebtsToMeDto } from './dto/close.debtsToMe.dto';

@Injectable()
export class DebtsToMeService {
	constructor(
		@InjectModel(DebtsToMeModel)
		private readonly debtsToMeModel: ReturnModelType<typeof DebtsToMeModel>,
		private readonly userService: UserService,
	) {}

	async getDebt(email, name) {
		return await this.debtsToMeModel
			.findOne({ name: name, email: email })
			.exec();
	}

	async addDebtsToMe(
		email: string,
		dto: AddDebtsToMeDto,
	): Promise<DebtsToMeModel | UserModel> {
		const debt = await this.getDebt(email, dto.name);
		if (debt) {
			debt.amount += dto.amount;
			await debt.save();
			return debt;
		}
		const newDebt = new this.debtsToMeModel({
			email,
			name: dto.name,
			amount: dto.amount,
			debtDate: Date.now(),
		});
		await newDebt.save();
		const user = await this.userService.findUser(email);
		user.debtsToMe = [...user.debtsToMe, newDebt.id];
		await user.save();
		return user;
	}

	async deleteDebtsToMe(
		email: string,
		dto: RemoveDebtsToMeDto,
	): Promise<DebtsToMeModel | number> {
		const debt = await this.getDebt(email, dto.name);
		if (!debt) return -1;
		const user = await this.userService.findUser(email);
		user.debtsToMe.splice(user.debtsToMe.indexOf(debt.id));
		await user.save();
		await debt.deleteOne();
		await debt.save;
		return debt;
	}

	async editDebtsToMe(
		email: string,
		dto: EditDebtsToMeDto,
	): Promise<DebtsToMeModel | number> {
		const debt = await this.getDebt(email, dto.name);
		if (!debt) return -1;
		debt.amount = dto.editedAmount;
		await debt.save();
		return debt;
	}

	async getDebtsList(email: string): Promise<DebtsToMeModel[]> {
		const user = await this.userService.getUserWithPopulate(email);
		return user['debtsToMe'];
	}

	async getRangedDebtsList(
		email: string,
		step = 10,
		current = 0,
	): Promise<DebtsToMeModel[]> {
		return await this.debtsToMeModel
			.find({ email })
			.limit((current + 1) * step)
			.skip(current * step);
	}

	async getTotalDebts(email: string): Promise<number> {
		const debtsList = await this.getDebtsList(email);
		return debtsList.map((el) => el.amount).reduce((acc, el) => acc + el, 0);
	}

	async closeDebtToMe(email: string, dto: CloseDebtsToMeDto) {
		const id = dto.id;
		const debt = this.debtsToMeModel.findOne({ _id: id });
		debt.isClosed = true;
		debt.save();
		return debt;
	}
}
