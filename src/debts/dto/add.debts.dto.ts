import { IsNumber, IsString } from 'class-validator';
import { debt } from '../debts.type';

export class AddDebtsDto {
	@IsString()
	name: string;

	@IsNumber()
	amount: number;

	debtType: debt;
}
