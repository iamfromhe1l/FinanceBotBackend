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
import { IncomeService } from './income.service';
import { IncomeDto } from './dto/Income.dto';
import { GetCurrentUserEmail } from 'src/common/decorators/get-current-userEmail.decorator';
import { IncomeModel } from './income.model';

@Controller('income')
export class IncomeController {
	constructor(private readonly incomeService: IncomeService) {}
	@Post('create')
	async createIncome(
		@GetCurrentUserEmail() email: string,
		@Body() dto: IncomeDto,
	) {
		return this.incomeService.createIncome(email, dto);
	}
	@Get('incomesList')
	async getDebtsList(
		@GetCurrentUserEmail() email: string,
	): Promise<IncomeModel[]> {
		return this.incomeService.getIncomesList(email);
	}

	@Get('rangedIncomesList')
	async getRangedDebtsList(
		@GetCurrentUserEmail() email: string,
		@Query('step') step: number,
		@Query('current') current: number,
	): Promise<IncomeModel[]> {
		return this.incomeService.getRangedIncomesList(email, step, current);
	}

	@Put(':title')
	async stopSchedule(
		@GetCurrentUserEmail() email: string,
		@Param('title') title: string,
	) {
		return this.incomeService.stopScheduleIncomes(email, title);
	}

	@Delete(':title')
	async deleteIncome(
		@GetCurrentUserEmail() email: string,
		@Param('title') title: string,
	) {
		return this.incomeService.deleteIncome(email, title);
	}
}
