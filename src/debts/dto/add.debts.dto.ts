import {
	IsBoolean,
	IsEnum,
	IsIn,
	IsNotEmpty,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
} from "class-validator";
import { DebtHolderEnum, debtHolderType } from "../debts.type";
import { availableCurrency, availableCurrencysList } from "../../balance/balance.types";
import { balanceExceptions } from "../../common/exceptions/exception.constants";

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
	@IsIn(availableCurrencysList, { message: balanceExceptions.CURRENCY_NOT_EXIST})
	currency: availableCurrency;

	@IsNotEmpty()
	@IsEnum(DebtHolderEnum)
	debtType: debtHolderType;

	@IsNotEmpty()
	@IsBoolean()
	editBalance: boolean;

	@IsNotEmpty()
	@IsBoolean()
	isFixed: boolean;
}
