import { IsNumber, IsString } from 'class-validator';

export class EditDebtsToMeDto {
	@IsString()
	name: string;

	@IsNumber()
	editedAmount: number;
}
