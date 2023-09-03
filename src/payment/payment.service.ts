import {  Injectable } from '@nestjs/common';
import { PaymentDto } from './dto/payment.dto';
import { InjectModel } from 'nestjs-typegoose';
import { PaymentModel } from './payment.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { BalanceService } from 'src/balance/balance.service';
import { UserService } from 'src/user/user.service';
import { Types } from "mongoose";
import { PaymentsListDto } from './dto/rangedPayments.dto';
import { paymentExceptions, } from "src/common/exceptions/exception.constants";
import { ServiceException } from "../common/exceptions/serviceException";
import { editBalanceByPaymentType } from "./payment.type";
import { Cron, CronExpression } from "@nestjs/schedule";

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

	async getPaymentById(email: string, id: Types.ObjectId) {
		try {
			const payment = await this.paymentModel.findById(id);
			if (payment.email == email) return payment;
			throw new ServiceException(paymentExceptions.EMAIL_AUTHORIZATION_ERROR);
		} catch {
			throw new ServiceException(paymentExceptions.PAYMENT_NOT_EXIST);
		}
	}

	async editBalanceByPayment(email: string, obj: editBalanceByPaymentType) {
		return this.balanceService.diffBalance(email, {
			diff: obj.type == 'income' ? obj.price : -obj.price,
			currencyName: obj.currencyName,
		});
	}

	async getPaymentsList(email: string): Promise<PaymentModel[]> {
		return this.paymentModel.find({ email });
	}

	async getRangedPaymentsList(email: string, step = 10, current = 0,): Promise<PaymentModel[]> {
		return this.paymentModel
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

	async getPaymentsListByDto(email: string, dto: PaymentsListDto,): Promise<PaymentModel[]> {
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

	async createPayment(email: string, dto: PaymentDto) {
		this.balanceService.isCurrencyExist(dto.currencyName);
		if (!dto.period)
			await this.editBalanceByPayment(email, {type: dto.type, price: dto.price, currencyName: dto.currencyName});
		const paymentData = {
			email,
			title: dto.title,
			price: dto.price,
			category: dto.category,
			type: dto.type,
			currencyName: dto.currencyName,
		};
		if (dto.period) {
			Object.assign(paymentData,{
				period: dto.period,
				nextDate: await this.updateNextDate(
					dto.period,
					dto.startDay ? dto.startDay : new Date(),
				),
			});
		}
		const newPayment = new this.paymentModel(paymentData);
		await this.userService.pushToNestedArray(email, newPayment._id, 'payments');
		return newPayment.save();
	}

	async checkAllPayments(): Promise<void> {
		for await (const payment of this.paymentModel.find())
			if (payment.period && !payment.lastDate && payment.nextDate < new Date()) {
				await this.editBalanceByPayment(payment.email, {type: payment.type, price: payment.price, currencyName: payment.currencyName});
				payment.nextDate = await this.updateNextDate(payment.period, payment.nextDate,);
			}
	}

	async updateNextDate(period: number, startDate: Date): Promise<Date> {
		const currentDate: Date = startDate;
		currentDate.setDate(currentDate.getDate() + period);
		return currentDate;
	}


	async stopPaymentScheduleById(id: Types.ObjectId): Promise<PaymentModel> {
		const payment = await this.paymentModel.findOne({ _id: id});
		if (!payment || !payment.nextDate) throw new ServiceException(paymentExceptions.WHAT_ERROR_IS_IT);
		await this.checkAllPayments();
		await payment.updateOne(
			{ $unset: { nextDate: 1 }, $set: { lastDate: Date.now() } },
		);
		return payment;
	}

	async deletePayment(email: string, title: string,): Promise<PaymentModel> {
		const payment = await this.paymentModel.findOne({
			email: email,
			title: title,
		});
		if (!payment) throw new ServiceException(paymentExceptions.CANT_DELETE_PAYMENT);
		await this.userService.popFromNestedArray(email, payment._id, 'payments');
		return payment.deleteOne();
	}
}
