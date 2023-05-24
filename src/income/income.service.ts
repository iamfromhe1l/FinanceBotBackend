import { Injectable } from '@nestjs/common';
import { IncomeDto } from './dto/Income.dto';
import { InjectModel } from 'nestjs-typegoose';
import { IncomeModel } from './income.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { BalanceService } from 'src/balance/balance.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/user/user.service';

@Injectable()
export class IncomeService {
	constructor(
		@InjectModel(IncomeModel)
		private readonly incomeModel: ReturnModelType<typeof IncomeModel>,
		private readonly balanceService: BalanceService,
		private readonly userService: UserService,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_10AM)
	async handleCron(): Promise<void> {
		await this.checkAllIncomes();
	}

	async createIncome(dto: IncomeDto) {
		const newIncome = await new this.incomeModel({
			email: dto.email,
			title: dto.title,
			price: dto.price,
			category: dto.category,
			period: dto.period,
			nextDate: await this.updateNextDate(dto.period),
		});
		const user = await this.userService.findUser({ email: dto.email });
		user.incomes = [...user.incomes, newIncome.id];
		await user.save();
		return newIncome.save();
	}
	async checkAllIncomes(): Promise<void> {
		for await (const income of this.incomeModel.find()) {
			if (income.nextDate < new Date()) {
				this.balanceService.diffBalace(income.email, { diff: income.price });
				income.nextDate = await this.updateNextDate(income.period);
			}
		}
	}

	async updateNextDate(period: number): Promise<Date> {
		const currentDate: Date = new Date();
		currentDate.setDate(currentDate.getDate() + period);
		return currentDate;
	}
}
