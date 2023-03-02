import { Body, Controller, Post } from '@nestjs/common';
import { EditBalanceDto } from './dto/edit.balance.dto';
import { BalanceService } from './balance.service';
import { DiffBalanceDto } from './dto/diff.balance.dto';

@Controller('balance')
export class BalanceController {
	constructor(private readonly balanceService: BalanceService) {}
	@Post('edit')
	async editBalance(@Body() dto: EditBalanceDto) {
		return this.balanceService.editBalance(dto);
	}

	@Post('diff')
	async addToBalance(@Body() dto: DiffBalanceDto) {
		return this.balanceService.diffBalace(dto);
	}
}
