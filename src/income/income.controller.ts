import { Body, Controller, Post } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeDto } from './dto/Income.dto';
import { GetCurrentUserEmail } from 'src/common/decorators/get-current-userEmail.decorator';

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
}
