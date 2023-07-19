import { IsNumber, IsString } from 'class-validator';
import { debt } from '../debts.type';
import {availableCurrency} from "../../balance/names";

export class EditDebtsDto {
	@IsString()
	name: string;

	@IsNumber()
	editedAmount: number;

	currency: availableCurrency;

	debtType: debt;
}
