import {IsBoolean, IsNumber, IsString} from 'class-validator';
import { debt } from '../debts.type';
import {availableCurrency} from "../../balance/names";

export class AddDebtsDto {
	@IsString()
	name: string;

	@IsNumber()
	amount: number;

	currency: availableCurrency;

	debtType: debt;

	@IsBoolean()
	editBalance: boolean;

	@IsBoolean()
	isFixed: boolean;
}
