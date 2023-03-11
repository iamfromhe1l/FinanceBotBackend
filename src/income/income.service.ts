import { Injectable } from '@nestjs/common';
import { IncomeDto } from './dto/Income.dto';
import { InjectModel } from 'nestjs-typegoose';
import { IncomeModel } from './income.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserModel } from 'src/auth/user.model';
import { BalanceService } from 'src/balance/balance.service';

@Injectable()
export class IncomeService {
	constructor(
		@InjectModel(IncomeModel)
		private readonly incomeModel: ReturnModelType<typeof IncomeModel>,
		private readonly balanceService: BalanceService,
	) {}
	async createIncome(dto: IncomeDto) {
		const newIncome = new this.incomeModel({
			email: dto.email,
			title: dto.title,
			price: dto.price,
			category: dto.category,
			period: dto.period,
			nextDate: await this.updateNextDate(dto.period),
		});
		return newIncome.save();
	}
	async checkAllIncomes() {
		for await (const income of this.incomeModel.find()) {
			if (income.nextDate < new Date()) {
				this.balanceService.diffBalace({
					email: income.email,
					diff: income.price,
				});
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
