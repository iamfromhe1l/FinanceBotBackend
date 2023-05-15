import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { DebtsToMeModel } from './debtsToMe.model';
import { AddDebtsToMeDto } from './dto/add.debtsToMe.dto';
import { RemoveDebtsToMeDto } from './dto/remove.debtsToMe.dto';
import { UserService } from '../user/user.service';
import { ValidateDto } from '../globalDto/validate.dto';
import { EditDebtsToMeDto } from './dto/edit.debtsToMe.dto';
import { UserModel } from '../user/user.model';

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
		dto: AddDebtsToMeDto,
	): Promise<DebtsToMeModel | UserModel> {
		const debt = await this.getDebt(dto.email, dto.name);
		if (debt) {
			debt.amount += dto.amount;
			await debt.save();
			return debt;
		}
		const newDebt = new this.debtsToMeModel({
			email: dto.email,
			name: dto.name,
			amount: dto.amount,
			debtDate: Date.now(),
		});
		await newDebt.save();
		const user = await this.userService.findUser({ email: dto.email });
		user.debtsToMe = [...user.debtsToMe, newDebt.id];
		await user.save();
		return user;
	}

	async deleteDebtsToMe(
		dto: RemoveDebtsToMeDto,
	): Promise<DebtsToMeModel | number> {
		const debt = await this.getDebt(dto.email, dto.name);
		if (!debt) return -1;
		const user = await this.userService.findUser({ email: dto.email });
		user.debtsToMe.splice(user.debtsToMe.indexOf(debt.id));
		await user.save();
		await debt.remove();
		return debt;
	}

	async editDebtsToMe(dto: EditDebtsToMeDto): Promise<DebtsToMeModel | number> {
		const debt = await this.getDebt(dto.email, dto.name);
		if (!debt) return -1;
		debt.amount = dto.editedAmount;
		await debt.save();
		return debt;
	}

	async getDebtsList(dto: ValidateDto): Promise<DebtsToMeModel[]> {
		const user = await this.userService.getUserWithPopulate({
			email: dto.email,
		});
		return user['debtsToMe'];
	}

	async getTotalDebts(dto: ValidateDto): Promise<number> {
		const debtsList = await this.getDebtsList(dto);
		return debtsList.map((el) => el.amount).reduce((acc, el) => acc + el, 0);
	}
}
