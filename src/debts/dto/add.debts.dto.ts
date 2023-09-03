import { IsBoolean, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { debtHolderType } from '../debts.type';
import { availableCurrency } from "../../balance/balance.types";

export class AddDebtsDto {
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(12)
	@IsString()
	name: string;

	@IsNotEmpty()
	@Min(1)
	@Max(1000000)
	@IsNumber()
	amount: number;

	@IsNotEmpty()
	// TODO Проверить что валюта существует c помощью валидатора
	currency: availableCurrency;

	@IsNotEmpty()
	// TODO Проверить что валюта существует c помощью валидатора
	debtType: debtHolderType;

	@IsNotEmpty()
	@IsBoolean()
	editBalance: boolean;

	@IsNotEmpty()
	@IsBoolean()
	isFixed: boolean;
}
