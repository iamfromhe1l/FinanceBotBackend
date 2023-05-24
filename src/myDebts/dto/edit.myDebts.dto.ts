import { IsNumber, IsString } from 'class-validator';

export class EditMyDebtsDto {
	@IsString()
	name: string;

	@IsNumber()
	editedAmount: number;
}
