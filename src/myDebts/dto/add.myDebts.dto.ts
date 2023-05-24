import { IsNumber, IsString } from 'class-validator';

export class AddMyDebtsDto {
	@IsString()
	name: string;

	@IsNumber()
	amount: number;
}
