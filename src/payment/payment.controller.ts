import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from './dto/payment.dto';
import { GetCurrentUserEmail } from 'src/common/decorators/get-current-userEmail.decorator';
import { PaymentModel } from './payment.model';
import { Types } from 'mongoose';
import { PaymentsListDto } from './dto/rangedPayments.dto';
import { payment } from "./payment.type";

@Controller('payment')
export class PaymentController {
	constructor(private readonly paymentService: PaymentService) {}

	@Post('create')
	async createPayment(
		@GetCurrentUserEmail() email: string,
		@Body() dto: PaymentDto,
	): Promise<PaymentModel> {
		return await this.paymentService.createPayment(email, dto);
	}

	@Get('list')
	async getAllPaymentsList(
		@GetCurrentUserEmail() email: string,
		@Query("paymentType") paymentType: payment,
	): Promise<PaymentModel[]> {
		return await this.paymentService.getPaymentsList(email, paymentType);
	}

	@Get('listByDto')
	async getPaymentsListByDto(
		@GetCurrentUserEmail() email: string,
		@Body() dto: PaymentsListDto,
	): Promise<PaymentModel[]> {
		return await this.paymentService.getPaymentsListByDto(email, dto);
	}



	@Get('ranged')
	async getRangedPaymentsList(
		@GetCurrentUserEmail() email: string,
		@Query('step') step: number,
		@Query('current') current: number,
	): Promise<PaymentModel[]> {
		console.log(email, step, current);
		return await this.paymentService.getRangedPaymentsList(email, step, current);
	}

	@Get('rangedByDto')
	async getRangedPaymentsListByDto(
		@GetCurrentUserEmail() email: string,
		@Query('step') step: number,
		@Query('current') current: number,
		@Body() dto: PaymentsListDto,
	): Promise<PaymentModel[]> {
		return await this.paymentService.getRangedPaymentsListByDto(
			email,
			dto,
			step,
			current,
		);
	}

	@Get(':id')
	async getPayment(
		@GetCurrentUserEmail() email: string,
		@Param('id') id: Types.ObjectId,
	): Promise<PaymentModel> {
		return await this.paymentService.getPaymentById(email, id);
	}

	@Put(':id')
	async stopPaymentScheduleById(
		@GetCurrentUserEmail() email: string,
		@Param('id') id: Types.ObjectId,
	): Promise<PaymentModel> {
		return await this.paymentService.stopPaymentScheduleById(email, id);
	}

	@Delete(':id')
	async deletePayment(
		@GetCurrentUserEmail() email: string,
		@Param('id') id: Types.ObjectId,
	): Promise<void> {
		return await this.paymentService.deletePayment(email, id);
	}
}
