import {
	IsDateString, IsEnum, IsIn,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
} from "class-validator";
import { payment, paymentEnum } from "../payment.type";
import { availableCurrency, availableCurrencysList } from "../../balance/balance.types";
import { balanceExceptions } from "../../common/exceptions/exception.constants";

export class PaymentDto {
	@IsNotEmpty()
	@MaxLength(20)
	@IsString()
	title: string;

	@IsNotEmpty()
	@Min(1)
	@Max(1000000000)
	@IsNumber()
	price: number;

	@IsNotEmpty()
	@IsIn(availableCurrencysList, { message: balanceExceptions.CURRENCY_NOT_EXIST})
	currencyName: availableCurrency;

	@IsOptional()
	@Max(365)
	@Min(1)
	@IsNumber()
	period?: number;

	@IsOptional()
	@IsDateString()
	startDay?: Date;

	@IsNotEmpty()
	@MaxLength(20)
	@IsString()
	category: string;

	@IsNotEmpty()
	@IsEnum(paymentEnum)
	type: payment;
}
