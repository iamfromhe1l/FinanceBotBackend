import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/auth/user.model';
import { EditBalanceDto } from './dto/edit.balance.dto';
import { ReturnModelType } from '@typegoose/typegoose';
import { DiffBalanceDto } from './dto/diff.balance.dto';
import { EmailDto } from 'src/globalDto/email.dto';

@Injectable()
export class BalanceService {
	constructor(
		@InjectModel(UserModel)
		private readonly userModel: ReturnModelType<typeof UserModel>,
	) {}

	async getUser(email) {
		return await this.userModel.findOne({ email }).exec();
	}

	async editBalance(dto: EditBalanceDto) {
		const user = await this.getUser(dto.email);
		user.balance = dto.editedBalance;
		await user.save();
		return { balance: user.balance };
	}

	async diffBalace(dto: DiffBalanceDto) {
		const user = await this.getUser(dto.email);
		user.balance += dto.diff;
		user.save();
		return { balance: user.balance };
	}

	async getBalance({ email }: EmailDto) {
		return (await this.getUser(email)).balance;
	}
}
