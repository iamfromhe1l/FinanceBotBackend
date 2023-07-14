import { IsString } from 'class-validator';
import { debt } from '../debts.type';

export class RemoveDebtsDto {
	@IsString()
	name: string;

	debtType: debt;
}
