import { Injectable } from '@nestjs/common';
import { PaymentDto } from './dto/payment.dto';
import { InjectModel } from 'nestjs-typegoose';
import { PaymentModel } from './payment.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { BalanceService } from 'src/balance/balance.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PaymentService {
	constructor(
		@InjectModel(PaymentModel)
		private readonly paymentModel: ReturnModelType<typeof PaymentModel>,
		private readonly balanceService: BalanceService,
		private readonly userService: UserService,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_10AM)
	async handleCron(): Promise<void> {
		await this.checkAllPayments();
	}

	async getPaymentById(id) {
		return this.paymentModel.find({ id });
	}

	async getPaymentsList(email: string) {
		return this.paymentModel.find({ email });
	}

	async getRangedPaymentsList(email: string, step = 10, current = 0) {
		return this.paymentModel
			.find({ email })
			.limit((current + 1) * step)
			.skip(current * step);
	}
	async createPayment(email: string, dto: PaymentDto) {
		let newIncome;
		if (dto.period != undefined) {
			newIncome = new this.paymentModel({
				email,
				title: dto.title,
				price: dto.price,
				category: dto.category,
				period: dto.period,
				nextDate: await this.updateNextDate(dto.period),
				incomeDate: Date.now(),
			});
		} else {
			newIncome = new this.paymentModel({
				email,
				title: dto.title,
				price: dto.price,
				category: dto.category,
				incomeDate: Date.now(),
			});
		}

		const user = await this.userService.findUser(email);
		user.payments = [...user.payments, newIncome.id];
		await user.save();
		return newIncome.save();
	}

	async checkAllPayments(): Promise<void> {
		for await (const income of this.paymentModel.find()) {
			if (income.period && income.nextDate < new Date()) {
				await this.balanceService.diffBalance(income.email, { diff: income.price });
				income.nextDate = await this.updateNextDate(income.period);
			}
		}
	}

	async updateNextDate(period: number): Promise<Date> {
		const currentDate: Date = new Date();
		currentDate.setDate(currentDate.getDate() + period);
		return currentDate;
	}

	async stopPaymentSchedule(email: string, title: string): Promise<void> {
		const income = await this.paymentModel.findOne({
			email: email,
			title: title,
		});
		if (!income.nextDate) {
			return;
		}
		await this.checkAllPayments();
		await this.paymentModel.updateOne(
			{ email: email, title: title },
			{ $unset: { nextDate: 1 }, $set: { lastDate: Date.now() } },
		);
	}

	async deletePayment(
		email: string,
		title: string,
	): Promise<PaymentModel | number> {
		const income = await this.paymentModel.findOne({
			email: email,
			title: title,
		});
		if (!income) return -1;
		const user = await this.userService.findUser(email);
		user.payments.splice(user.payments.indexOf(income.id));
		await user.save();
		await income.deleteOne();
		await income.save();
		return income;
	}
}
