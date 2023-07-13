import { IsNumber, IsString } from 'class-validator';

export class EditDebtsDto {
	@IsString()
	name: string;

	@IsNumber()
	editedAmount: number;
}
