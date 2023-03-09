import { IsEmail, IsNumber, IsString } from 'class-validator';

export class IncomeDto {
	@IsEmail()
	email: string;

	@IsNumber()
	price: number;

	@IsNumber()
	period: number;

	@IsString()
	category: string;
}
