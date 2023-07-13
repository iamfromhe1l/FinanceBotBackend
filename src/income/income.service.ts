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

	async createIncome(email: string, dto: IncomeDto) {
		let newIncome;
		if (dto.period!=undefined){
			newIncome = await new this.incomeModel({
				email,
				title: dto.title,
				price: dto.price,
				category: dto.category,
				period: dto.period,
				nextDate: await this.updateNextDate(dto.period),
				incomeDate: Date.now()
			});
		}else{
			newIncome = await new this.incomeModel({
				email,
				title: dto.title,
				price: dto.price,
				category: dto.category,
				incomeDate: Date.now()
			});
		}

		const user = await this.userService.findUser(email);
		user.incomes = [...user.incomes, newIncome.id];
		await user.save();
		return newIncome.save();
	}
	async checkAllIncomes(): Promise<void> {
		for await (const income of this.incomeModel.find()) {
			if (income.period && income.nextDate < new Date()) {
				this.balanceService.diffBalance(income.email, { diff: income.price });
				income.nextDate = await this.updateNextDate(income.period);
			}
		}
	}

	async updateNextDate(period: number): Promise<Date> {
		const currentDate: Date = new Date();
		currentDate.setDate(currentDate.getDate() + period);
		return currentDate;
	}

	async stopScheduleIncomes(email: string,title: string): Promise<void>{
		const income = await this.incomeModel.findOne({  email: email,title:title });
		if (!income.nextDate) {
			return ;
		}
		await this.checkAllIncomes();
		await this.incomeModel.updateOne(
			{  email: email,title:title },
			{ $unset: { nextDate: 1 }, $set: { lastDate: Date.now()} },
		);
	}

	async deleteIncome(email: string,title: string): Promise<IncomeModel | number>{
		const income = await this.incomeModel.findOne({  email: email,title:title });
		if (!income) return -1;
		const user = await this.userService.findUser(email);
		user.debtsToMe.splice(user.debtsToMe.indexOf(income.id));
		await user.save();
		await income.deleteOne();
		await income.save;
		return income;
	}
}
