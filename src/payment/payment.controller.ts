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
import { ObjectId } from 'mongoose';
import { PaymentsListDto } from './dto/rangedPayments.dto';

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
	async getPaymentsList(
		@GetCurrentUserEmail() email: string,
	): Promise<PaymentModel[]> {
		return await this.getPaymentsList(email);
	}

	@Get('listByDto')
	async getPaymentsListByDto(
		@GetCurrentUserEmail() email: string,
		@Body() dto: PaymentsListDto,
	): Promise<PaymentModel[]> {
		return await this.paymentService.getPaymentsListByDto(email, dto);
	}

	@Get(':id')
	async getPayment(
		@GetCurrentUserEmail() email: string,
		@Param('id') id: ObjectId,
	): Promise<PaymentModel | null> {
		return await this.paymentService.getPaymentById(email, id);
	}

	@Get('ranged')
	async getRangedPaymentsList(
		@GetCurrentUserEmail() email: string,
		@Query('step') step: number,
		@Query('current') current: number,
	): Promise<PaymentModel[]> {
		return await this.paymentService.getRangedPaymentsList(
			email,
			step,
			current,
		);
	}

	@Put(':id')
	async stopPaymentScheduleById(
		@GetCurrentUserEmail() email: string,
		@Param('id') id: ObjectId,
	): Promise<PaymentModel | number> {
		return await this.paymentService.stopPaymentScheduleById(email, id);
	}

	@Delete(':title')
	async deletePayment(
		@GetCurrentUserEmail() email: string,
		@Param('title') title: string,
	): Promise<PaymentModel | number> {
		return await this.paymentService.deletePayment(email, title);
	}
}
