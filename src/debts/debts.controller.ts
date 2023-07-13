import {
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { DebtsService } from './debts.service';
import { AddDebtsDto } from './dto/add.debts.dto';
import { RemoveDebtsDto } from './dto/remove.debts.dto';
import { EditDebtsDto } from './dto/edit.debts.dto';
import { DebtsModel } from './debts.model';
import { UserModel } from '../user/user.model';
import { GetCurrentUserEmail } from 'src/common/decorators/get-current-userEmail.decorator';
import { CloseDebtsDto } from './dto/close.debts.dto';

@Controller('debts')
export class DebtsController {
	constructor(private readonly debtsService: DebtsService) {}

	@Post('add')
	async addDebt(
		@GetCurrentUserEmail() email: string,
		@Body() dto: AddDebtsDto,
	): Promise<DebtsModel | UserModel> {
		return this.debtsService.addDebt(email, dto);
	}

	@Post('close')
	async closeDebt(
		@GetCurrentUserEmail() email: string,
		@Body() dto: CloseDebtsDto
	): Promise<void>{
		return this.debtsService.closeDebt(email,dto);
	}

	@Delete()
	async deleteDebt(
		@GetCurrentUserEmail() email: string,
		@Body() dto: RemoveDebtsDto,
	): Promise<DebtsModel | number> {
		return this.debtsService.deleteDebt(email, dto);
	}

	@Get('debtsList')
	async getDebtsList(
		@GetCurrentUserEmail() email: string,
	): Promise<DebtsModel[]> {
		return this.debtsService.getDebtsList(email);
	}

	@Get('rangedDebtsList')
	async getRangedDebtsList(
		@GetCurrentUserEmail() email: string,
		@Query('step') step: number,
		@Query('current') current: number,
	): Promise<DebtsModel[]> {
		return this.debtsService.getRangedDebtsList(email, step, current);
	}

	@Get('debtsTotal')
	async getTotalDebts(@GetCurrentUserEmail() email: string): Promise<number> {
		return this.debtsService.getTotalDebts(email);
	}

	@Put()
	async editDebts(
		@GetCurrentUserEmail() email: string,
		@Body() dto: EditDebtsDto,
	): Promise<DebtsModel | number> {
		return this.debtsService.editDebt(email, dto);
	}
}
