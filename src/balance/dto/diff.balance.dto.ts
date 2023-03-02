import { IsEmail, IsNumber } from 'class-validator';

export class DiffBalanceDto {
	@IsEmail()
	email: string;

	@IsNumber()
	diff: number;
}
