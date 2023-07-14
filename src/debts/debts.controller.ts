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
import { DebtsService } from './debts.service';
import { AddDebtsDto } from './dto/add.debts.dto';
import { RemoveDebtsDto } from './dto/remove.debts.dto';
import { EditDebtsDto } from './dto/edit.debts.dto';
import { DebtsModel } from './debts.model';
import { UserModel } from '../user/user.model';
import { GetCurrentUserEmail } from 'src/common/decorators/get-current-userEmail.decorator';
import { CloseDebtsDto } from './dto/close.debts.dto';
import { debt } from './debts.type';
import { ObjectId } from 'mongoose';

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
		@Body() dto: CloseDebtsDto,
	): Promise<DebtsModel | number> {
		return this.debtsService.closeDebt(email, dto);
	}

	@Delete()
	async deleteDebt(
		@GetCurrentUserEmail() email: string,
		@Body() dto: RemoveDebtsDto,
	): Promise<DebtsModel | number> {
		return this.debtsService.deleteDebt(email, dto);
	}

	@Delete(':id')
	async deleteDebtById(
		@GetCurrentUserEmail() email: string,
		@Param('id') id: ObjectId,
	) {
		return this.debtsService.deleteDebtById(email, id);
	}

	@Get('debtsList')
	async getDebtsList(
		@GetCurrentUserEmail() email: string,
		@Body() body: { debtType: debt },
	): Promise<DebtsModel[]> {
		return this.debtsService.getDebtsList(email, body.debtType);
	}

	@Get('rangedDebtsList')
	async getRangedDebtsList(
		@GetCurrentUserEmail() email: string,
		@Query('step') step: number,
		@Query('current') current: number,
		@Body() body: { debtType: debt },
	): Promise<DebtsModel[]> {
		return this.debtsService.getRangedDebtsList(
			email,
			body.debtType,
			step,
			current,
		);
	}

	@Get('debtsTotal')
	async getTotalDebts(
		@GetCurrentUserEmail() email: string,
		@Body() body: { debtType: debt },
	): Promise<number> {
		return this.debtsService.getTotalDebts(email, body.debtType);
	}

	@Put()
	async editDebts(
		@GetCurrentUserEmail() email: string,
		@Body() dto: EditDebtsDto,
	): Promise<DebtsModel | number> {
		return this.debtsService.editDebt(email, dto);
	}

	@Put(':id')
	async editDebtById(
		@GetCurrentUserEmail() email: string,
		@Body() body: { editedAmount: number },
		@Param('id') id: ObjectId,
	): Promise<DebtsModel | number> {
		return this.debtsService.editDebtById(email, id, body.editedAmount);
	}
}
