import { Body, Controller, Get, Post } from '@nestjs/common';
import { EditBalanceDto } from './dto/edit.balance.dto';
import { BalanceService } from './balance.service';
import { DiffBalanceDto } from './dto/diff.balance.dto';
import { EmailDto } from 'src/globalDto/email.dto';

@Controller('balance')
export class BalanceController {
	constructor(private readonly balanceService: BalanceService) {}
	@Post('edit')
	async editBalance(@Body() dto: EditBalanceDto) {
		return this.balanceService.editBalance(dto);
	}

	@Post('diff')
	async diffBalance(@Body() dto: DiffBalanceDto) {
		return this.balanceService.diffBalace(dto);
	}

	@Get('getBalance')
	async getBalance(@Body() dto: EmailDto) {
		return this.balanceService.getBalance(dto);
	}
}
