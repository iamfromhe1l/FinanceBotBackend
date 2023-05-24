import { IsNumber } from 'class-validator';

export class EditBalanceDto {
	@IsNumber()
	editedBalance: number;
}
