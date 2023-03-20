import { Injectable } from '@nestjs/common';
import { EditBalanceDto } from './dto/edit.balance.dto';
import { DiffBalanceDto } from './dto/diff.balance.dto';
import { ValidateDto } from 'src/globalDto/validate.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BalanceService {
	constructor(private readonly userService: UserService) {}

	async editBalance(dto: EditBalanceDto): Promise<{ balance: number }> {
		const user = await this.userService.findUser({ email: dto.email });
		user.balance = dto.editedBalance;
		await user.save();
		return { balance: user.balance };
	}

	async diffBalace(dto: DiffBalanceDto): Promise<{ balance: number }> {
		const user = await this.userService.findUser({ email: dto.email });
		user.balance += dto.diff;
		await user.save();
		return { balance: user.balance };
	}

	async getBalance({ email }: ValidateDto): Promise<number> {
		return (await this.userService.findUser({ email })).balance;
	}
}
