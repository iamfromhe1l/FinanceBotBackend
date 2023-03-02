import { IsEmail, IsNumber } from 'class-validator';

export class EditBalanceDto {
	@IsEmail()
	email: string;

	@IsNumber()
	editedBalance: number;
}
