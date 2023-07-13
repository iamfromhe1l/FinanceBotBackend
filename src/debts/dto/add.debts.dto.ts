import { IsNumber, IsString } from 'class-validator';

export class AddDebtsDto {
	@IsString()
	name: string;

	@IsNumber()
	amount: number;
}
