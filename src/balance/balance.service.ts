import { Injectable } from '@nestjs/common';
import { EditBalanceDto } from './dto/edit.balance.dto';
import { DiffBalanceDto } from './dto/diff.balance.dto';
import { ValidateDto } from 'src/globalDto/validate.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BalanceService {
	constructor(private readonly userService: UserService) {}

	async editBalance(dto: EditBalanceDto) {
		const user = await this.userService.findUser({ email: dto.email });
		user.balance = dto.editedBalance;
		await user.save();
		return { balance: user.balance };
	}

	async diffBalace(dto: DiffBalanceDto) {
		const user = await this.userService.findUser({ email: dto.email });
		user.balance += dto.diff;
		await user.save();
		return { balance: user.balance };
	}

	async getBalance({ email }: ValidateDto) {
		return (await this.userService.findUser({ email })).balance;
	}
}
