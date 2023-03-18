import { Body, Controller, Get, Post } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { ValidateDto } from 'src/globalDto/validate.dto';
import { EditBalanceDto } from './dto/edit.balance.dto';
import { DiffBalanceDto } from './dto/diff.balance.dto';

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
	async getBalance(@Body() dto: ValidateDto) {
		return this.balanceService.getBalance(dto);
	}
}
