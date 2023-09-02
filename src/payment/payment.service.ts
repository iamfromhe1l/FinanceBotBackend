import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaymentDto } from './dto/payment.dto';
import { InjectModel } from 'nestjs-typegoose';
import { PaymentModel } from './payment.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { BalanceService } from 'src/balance/balance.service';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/user/user.service';
import { ObjectId } from 'mongoose';
import { PaymentsListDto } from './dto/rangedPayments.dto';
// import { balanceTypes } from 'src/balance/balance.types';
import {
	balanceExceptions,
	paymentExceptions,
} from 'src/common/exceptions/exception.constants';

@Injectable()
export class PaymentService {
	constructor(
		@InjectModel(PaymentModel)
		private readonly paymentModel: ReturnModelType<typeof PaymentModel>,
		private readonly balanceService: BalanceService,
		private readonly userService: UserService,
	) {}

	// @Cron(CronExpression.EVERY_DAY_AT_10AM)
	// async handleCron(): Promise<void> {
	// 	await this.checkAllPayments();
	// }

	async getPaymentById(email: string, id: ObjectId) {
		try {
			const payment = await this.paymentModel.findById(id);
			if (payment.email == email) return payment;
			//'throw' of exception caught locally
			// throw new HttpException(
			// 	{
			// 		status: HttpStatus.UNAUTHORIZED,
			// 		error: paymentExceptions.EMAIL_AUTHORIZATION_ERROR,
			// 	},
			// 	HttpStatus.UNAUTHORIZED,
			// );
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

	async getPaymentsList(email: string): Promise<PaymentModel[]> {
		return this.paymentModel.find({ email });
	}

	async getRangedPaymentsList(
		email: string,
		step = 10,
		current = 0,
	): Promise<PaymentModel[]> {
		return await this.paymentModel
			.find({ email })
			.limit((current + 1) * step)
			.skip(current * step);
	}

	async getRangedPaymentsListByDto(
		email: string,
		dto: PaymentsListDto,
		step = 10,
		current = 0,
	): Promise<PaymentModel[]> {
		return dto.periodic
			? await this.paymentModel
					.find({
						email,
						type: dto.type,
						$and: [{ lastDate: undefined }, { nextDate: undefined }],
					})
					.limit((current + 1) * step)
					.slip(current * step)
			: await this.paymentModel
					.find({
						email,
						type: dto.type,
						$or: [
							{ lastDate: { $exists: true } },
							{ nextDate: { $exists: true } },
						],
					})
					.limit((current + 1) * step)
					.slip(current * step);
	}

	async getPaymentsListByDto(
		email: string,
		dto: PaymentsListDto,
	): Promise<PaymentModel[]> {
		return dto.periodic
			? await this.paymentModel.find({
					email,
					type: dto.type,
					$and: [{ lastDate: undefined }, { nextDate: undefined }],
			  })
			: await this.paymentModel.find({
					email,
					type: dto.type,
					$or: [
						{ lastDate: { $exists: true } },
						{ nextDate: { $exists: true } },
					],
			  });
	}


	// TODO diff_balance2 и уменьшить функцию
	// async createPayment(email: string, dto: PaymentDto) {
	// 	if (!Object.keys(names).includes(dto.currencyName))
	// 		throw new HttpException(
	// 			{
	// 				status: HttpStatus.UNPROCESSABLE_ENTITY,
	// 				error: balanceExceptions.CURRENCY_NOT_EXIST,
	// 			},
	// 			HttpStatus.UNPROCESSABLE_ENTITY,
	// 		);
	// 	const user = await this.userService.findUser(email);
	// 	if (!dto.period)
	// 		this.balanceService.diffBalance2(email, {
	// 			diff: dto.type == 'income' ? dto.price : -dto.price,
	// 			currencyName: dto.currencyName,
	// 		});
	// 	let newPayment;
	// 	if (dto.period) {
	// 		newPayment = new this.paymentModel({
	// 			email,
	// 			title: dto.title,
	// 			price: dto.price,
	// 			category: dto.category,
	// 			period: dto.period,
	// 			nextDate: await this.updateNextDate(
	// 				dto.period,
	// 				dto.startDay ? dto.startDay : new Date(),
	// 			),
	// 			currencyName: dto.currencyName,
	// 			type: dto.type,
	// 		});
	// 	} else {
	// 		newPayment = new this.paymentModel({
	// 			email,
	// 			title: dto.title,
	// 			price: dto.price,
	// 			currencyName: dto.currencyName,
	// 			category: dto.category,
	// 			type: dto.type,
	// 		});
	// 	}
	//
	// 	user.payments = [...user.payments, newPayment.id];
	// 	await user.save();
	// 	return newPayment.save();
	// }
	//
	async checkAllPayments(): Promise<void> {
		for await (const payment of this.paymentModel.find()) {
			if (
				payment.period &&
				!payment.lastDate &&
				payment.nextDate < new Date()
			) {
				//diff_balance 2 используется
				// await this.balanceService.diffBalance2(payment.email, {
				// 	diff: payment.type == 'income' ? payment.price : -payment.price,
				// 	currencyName: payment.currencyName,
				// });
				payment.nextDate = await this.updateNextDate(
					payment.period,
					payment.nextDate,
				);
			}
		}
	}
	// Использовалась старая версия diffBalance
	// async checkAllPayments(): Promise<void> {
	// 	for await (const income of this.paymentModel.find()) {
	// 		if (income.period && income.nextDate < new Date()) {
	// 			await this.balanceService.diffBalance(income.email, { diff: income.price });
	// 			income.nextDate = await this.updateNextDate(income.period);
	// 		}
	// 	}
	// }

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

	// async stopPaymentSchedule(email: string, title: string): Promise<void> {
	// 	const income = await this.paymentModel.findOne({
	// 		email: email,
	// 		title: title,
	// 	});
	// 	if (!income.nextDate) {
	// 		return;
	// 	}
	// 	await this.checkAllPayments();
	// 	await this.paymentModel.updateOne(
	// 		{ email: email, title: title },
	// 		{ $unset: { nextDate: 1 }, $set: { lastDate: Date.now() } },
	// 	);
	// }

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
