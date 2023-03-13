import { IsEmail, IsNumber, Max } from 'class-validator';

export class DiffBalanceDto {
	@IsEmail()
	email: string;

	@Max(1000000000)
	@IsNumber()
	diff: number;
}
