import {
	IsDateString,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
} from "class-validator";
import { payment } from '../payment.type';
import { availableCurrency } from "../../balance/balance.types";

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
	// TODO Проверить что валюта существует c помощью валидатора
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
	// TODO Проверить что валюта существует c помощью валидатора
	type: payment;
}
