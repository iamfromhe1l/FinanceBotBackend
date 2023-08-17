import {IsBoolean, IsNumber, IsString} from 'class-validator';
import { debtType } from '../debts.type';
import { availableCurrency } from "../../balance/balance.types";

export class AddDebtsDto {
	@IsString()
	name: string;

	@IsNumber()
	amount: number;

	currency: availableCurrency;

	debtType: debtType;

	@IsBoolean()
	editBalance: boolean;

	@IsBoolean()
	isFixed: boolean;
}
