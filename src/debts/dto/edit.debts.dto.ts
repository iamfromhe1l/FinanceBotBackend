import { IsNumber, IsString } from 'class-validator';
import { debt } from '../debts.type';

export class EditDebtsDto {
	@IsString()
	name: string;

	@IsNumber()
	editedAmount: number;

	debtType: debt;
}
