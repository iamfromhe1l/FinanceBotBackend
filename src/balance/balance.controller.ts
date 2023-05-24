import { Body, Controller, Get, Post } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { EditBalanceDto } from './dto/edit.balance.dto';
import { DiffBalanceDto } from './dto/diff.balance.dto';
import { GetCurrentUserEmail } from 'src/common/decorators/get-current-userEmail.decorator';

@Controller('balance')
export class BalanceController {
	constructor(private readonly balanceService: BalanceService) {}
	@Post('edit')
	async editBalance(@Body() dto: EditBalanceDto): Promise<{ balance: number }> {
		return await this.balanceService.editBalance(dto);
	}

	@Post('diff')
	async diffBalance(
		@GetCurrentUserEmail() email: string,
		@Body() dto: DiffBalanceDto,
	): Promise<{ balance: number }> {
		return await this.balanceService.diffBalace(email, dto);
	}

	@Get('get')
	async getBalance(@GetCurrentUserEmail() email: string): Promise<number> {
		return await this.balanceService.getBalance(email);
	}
}
