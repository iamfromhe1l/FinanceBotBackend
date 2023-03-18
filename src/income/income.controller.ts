import { Body, Controller, Post } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeDto } from './dto/Income.dto';

@Controller('income')
export class IncomeController {
	constructor(private readonly incomeService: IncomeService) {}
	@Post('create')
	async createIncome(@Body() dto: IncomeDto) {
		return this.incomeService.createIncome(dto);
	}
}
