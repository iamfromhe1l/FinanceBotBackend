import {Body, Controller, Delete, Get, Post, Put, Query} from '@nestjs/common';
import { DebtsToMeService } from './debtsToMe.service';
import { AddDebtsToMeDto } from './dto/add.debtsToMe.dto';
import { RemoveDebtsToMeDto } from './dto/remove.debtsToMe.dto';
import { EditDebtsToMeDto } from './dto/edit.debtsToMe.dto';
import { DebtsToMeModel } from './debtsToMe.model';
import { UserModel } from '../user/user.model';
import { GetCurrentUserEmail } from 'src/common/decorators/get-current-userEmail.decorator';

@Controller('debtsToMe')
export class DebtsToMeController {
	constructor(private readonly debtsToMeService: DebtsToMeService) {}

	@Post('add')
	async addDebtsToMe(
		@GetCurrentUserEmail() email: string,
		@Body() dto: AddDebtsToMeDto,
	): Promise<DebtsToMeModel | UserModel> {
		return this.debtsToMeService.addDebtsToMe(email, dto);
	}

	@Delete()
	async deleteDebtsToMe(
		@GetCurrentUserEmail() email: string,
		@Body() dto: RemoveDebtsToMeDto,
	): Promise<DebtsToMeModel | number> {
		return this.debtsToMeService.deleteDebtsToMe(email, dto);
	}

	@Get('debtsList')
	async getDebtsList(
		@GetCurrentUserEmail() email: string,
	): Promise<DebtsToMeModel[]> {
		return this.debtsToMeService.getDebtsList(email);
	}

	@Get('rangedDebtsList')
	async getRangedDebtsList(
		@GetCurrentUserEmail() email: string,
		@Query('step') step: number,
		@Query('current') current: number
	): Promise<DebtsToMeModel[]> {
		return this.debtsToMeService.getRangedDebtsList(email,step,current);
	}

	@Get('debtsTotal')
	async getTotalDebts(@GetCurrentUserEmail() email: string): Promise<number> {
		return this.debtsToMeService.getTotalDebts(email);
	}

	@Put()
	async editDebtsToMe(
		@GetCurrentUserEmail() email: string,
		@Body() dto: EditDebtsToMeDto,
	): Promise<DebtsToMeModel | number> {
		return this.debtsToMeService.editDebtsToMe(email, dto);
	}
}
