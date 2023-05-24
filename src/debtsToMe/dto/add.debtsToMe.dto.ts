import { IsNumber, IsString } from 'class-validator';

export class AddDebtsToMeDto {
	@IsString()
	name: string;

	@IsNumber()
	amount: number;
}
