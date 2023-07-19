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
import {ObjectId} from "mongoose";

@Controller('payment')
export class PaymentController {
	constructor(private readonly incomeService: PaymentService) {}

	@Post('create')
	async createPayment(
		@GetCurrentUserEmail() email: string,
		@Body() dto: PaymentDto,
	) {
		return this.incomeService.createPayment(email, dto);
	}

	@Get('list')
	async getPaymentsList(
		@GetCurrentUserEmail() email: string,
	): Promise<PaymentModel[]> {
		return this.incomeService.getPaymentsList(email);
	}

	@Get(':id')
	async getPayment(
		@GetCurrentUserEmail() email: string,
		@Param('id') id: ObjectId
	): Promise<PaymentModel[]> {
		return this.incomeService.getPaymentById(id);
	}

	@Get('ranged')
	async getRangedPaymentsList(
		@GetCurrentUserEmail() email: string,
		@Query('step') step: number,
		@Query('current') current: number,
	): Promise<PaymentModel[]> {
		return this.incomeService.getRangedPaymentsList(email, step, current);
	}

	// @Put(':title')
	// async stopPaymentSchedule(
	// 	@GetCurrentUserEmail() email: string,
	// 	@Param('title') title: string,
	// ) {
	// 	return this.incomeService.stopPaymentSchedule(email, title);
	// }

	@Delete(':title')
	async deletePayment(
		@GetCurrentUserEmail() email: string,
		@Param('title') title: string,
	) {
		return this.incomeService.deletePayment(email, title);
	}
}
