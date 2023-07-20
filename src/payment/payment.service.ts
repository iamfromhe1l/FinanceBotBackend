import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaymentDto } from './dto/payment.dto';
import { InjectModel } from 'nestjs-typegoose';
import { PaymentModel } from './payment.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { BalanceService } from 'src/balance/balance.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/user/user.service';
import { ObjectId } from 'mongoose';
import { PaymentsListDto } from './dto/rangedPayments.dto';
import { names } from 'src/balance/names';
import {
	balanceExceptions,
	paymentExceptions,
} from 'src/common/exception.constants';
import { Diff2BalanceDto } from 'src/balance/dto/diff2.balance.dto';

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

	async getPaymentById(email: string, id: ObjectId) {
		try {
			const payment = await this.paymentModel.findById(id);
			if (payment.email == email) return payment;
			throw new HttpException(
				{
					status: HttpStatus.UNAUTHORIZED,
					error: paymentExceptions.EMAIL_AUTHORIZATION_ERROR,
				},
				HttpStatus.UNAUTHORIZED,
			);
		} catch {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					error: paymentExceptions.PAYMENT_NOT_EXIST,
				},
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}
	}

	async getPaymentsList(email: string) {
		return await this.paymentModel.find({ email });
	}

	async getRangedPaymentsList(email: string, step = 10, current = 0) {
		return await this.paymentModel
			.find({ email })
			.limit((current + 1) * step)
			.skip(current * step);
	}

	async getPaymentsListByDto(
		email: string,
		dto: PaymentsListDto,
	): Promise<PaymentModel[]> {
		const payments = await this.paymentModel.find({ email, type: dto.type });
		return dto.periodic
			? payments.filter((el: PaymentModel) => el.nextDate || el.lastDate)
			: payments.filter((el: PaymentModel) => !el.nextDate && !el.lastDate);
	}

	async createPayment(email: string, dto: PaymentDto) {
		if (!Object.keys(names).includes(dto.currencyName))
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					error: balanceExceptions.CURRENCY_NOT_EXIST,
				},
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		const user = await this.userService.findUser(email);
		if (!dto.period)
			this.balanceService.diffBalance2(email, {
				diff: dto.type == 'income' ? dto.price : -dto.price,
				currencyName: dto.currencyName,
			});
		let newPayment;
		if (dto.period) {
			newPayment = new this.paymentModel({
				email,
				title: dto.title,
				price: dto.price,
				category: dto.category,
				period: dto.period,
				nextDate: await this.updateNextDate(
					dto.period,
					dto.startDay ? dto.startDay : new Date(),
				),
				currencyName: dto.currencyName,
				type: dto.type,
			});
		} else {
			newPayment = new this.paymentModel({
				email,
				title: dto.title,
				price: dto.price,
				currencyName: dto.currencyName,
				category: dto.category,
				type: dto.type,
			});
		}

		user.payments = [...user.payments, newPayment.id];
		await user.save();
		return newPayment.save();
	}

	async checkAllPayments(): Promise<void> {
		for await (const payment of this.paymentModel.find()) {
			if (
				payment.period &&
				!payment.lastDate &&
				payment.nextDate < new Date()
			) {
				await this.balanceService.diffBalance2(payment.email, {
					diff: payment.type == 'income' ? payment.price : -payment.price,
					currencyName: payment.currencyName,
				});
				payment.nextDate = await this.updateNextDate(
					payment.period,
					payment.nextDate,
				);
			}
		}
	}

	async updateNextDate(period: number, startDate: Date): Promise<Date> {
		const currentDate: Date = startDate;
		currentDate.setDate(currentDate.getDate() + period);
		return currentDate;
	}

	async stopPaymentSchedule(email: string, title: string): Promise<void> {
		const payment = await this.paymentModel.findOne({ email, title });
		if (payment.lastDate) {
			return;
		}
		payment.lastDate = new Date();
		payment.set('nextDate', undefined);
	}

	async stopPaymentScheduleById(
		email: string,
		id: ObjectId,
	): Promise<PaymentModel | number> {
		const payment = await this.getPaymentById(email, id);
		if (!payment || payment.lastDate) return -1;
		payment.lastDate = new Date();
		payment.set('nextDate', undefined);
		return payment.save();
	}

	async deletePayment(
		email: string,
		title: string,
	): Promise<PaymentModel | number> {
		const payment = await this.paymentModel.findOne({
			email: email,
			title: title,
		});
		if (!payment) return -1;
		const user = await this.userService.findUser(email);
		user.payments.splice(user.payments.indexOf(payment.id));
		await user.save();
		return payment.deleteOne();
	}
}
