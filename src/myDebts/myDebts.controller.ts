import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { MyDebtsService } from './myDebts.service';
import { AddMyDebtsDto } from './dto/add.myDebts.dto';
import { RemoveMyDebtsDto } from './dto/remove.myDebts.dto';
import { EditMyDebtsDto } from './dto/edit.myDebts.dto';
import { MyDebtsModel } from './myDebts.model';
import { UserModel } from '../user/user.model';
import { GetCurrentUserEmail } from 'src/common/decorators/get-current-userEmail.decorator';

@Controller('myDebts')
export class MyDebtsController {
	constructor(private readonly myDebtsService: MyDebtsService) {}

	@Post('add')
	async addMyDebt(
		@GetCurrentUserEmail() email: string,
		@Body() dto: AddMyDebtsDto,
	): Promise<MyDebtsModel | UserModel> {
		return this.myDebtsService.addMyDebt(email, dto);
	}

	@Delete()
	async deleteMyDebt(
		@GetCurrentUserEmail() email: string,
		@Body() dto: RemoveMyDebtsDto,
	): Promise<MyDebtsModel | number> {
		return this.myDebtsService.deleteMyDebt(email, dto);
	}

	@Get('debtsList')
	async getDebtsList(
		@GetCurrentUserEmail() email: string,
	): Promise<MyDebtsModel[]> {
		return this.myDebtsService.getDebtsList(email);
	}

	@Get('debtsTotal')
	async getTotalDebts(@GetCurrentUserEmail() email: string): Promise<number> {
		return this.myDebtsService.getTotalDebts(email);
	}

	@Put()
	async editMyDebt(
		@GetCurrentUserEmail() email: string,
		@Body() dto: EditMyDebtsDto,
	): Promise<MyDebtsModel | number> {
		return this.myDebtsService.editMyDebt(email, dto);
	}
}
