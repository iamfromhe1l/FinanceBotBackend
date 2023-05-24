import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { DebtsToMeService } from './debtsToMe.service';
import { AddDebtsToMeDto } from './dto/add.debtsToMe.dto';
import { RemoveDebtsToMeDto } from './dto/remove.debtsToMe.dto';
import { ValidateDto } from '../globalDto/validate.dto';
import { EditDebtsToMeDto } from './dto/edit.debtsToMe.dto';
import { DebtsToMeModel } from './debtsToMe.model';
import { UserModel } from '../user/user.model';

@Controller('debtsToMe')
export class DebtsToMeController {
	constructor(private readonly debtsToMeService: DebtsToMeService) {}

	@Post('add')
	async addDebtsToMe(
		@Body() dto: AddDebtsToMeDto,
	): Promise<DebtsToMeModel | UserModel> {
		return this.debtsToMeService.addDebtsToMe(dto);
	}

	@Delete()
	async deleteDebtsToMe(
		@Body() dto: RemoveDebtsToMeDto,
	): Promise<DebtsToMeModel | number> {
		return this.debtsToMeService.deleteDebtsToMe(dto);
	}

	@Get('debtsList')
	async getDebtsList(@Body() dto: ValidateDto): Promise<DebtsToMeModel[]> {
		return this.debtsToMeService.getDebtsList(dto);
	}

	@Get('debtsTotal')
	async getTotalDebts(@Body() dto: ValidateDto): Promise<number> {
		return this.debtsToMeService.getTotalDebts(dto);
	}

	@Put()
	async editDebtsToMe(
		@Body() dto: EditDebtsToMeDto,
	): Promise<DebtsToMeModel | number> {
		return this.debtsToMeService.editDebtsToMe(dto);
	}
}
