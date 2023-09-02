import {
	IsDateString,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
} from 'class-validator';
import { payment } from '../payment.type';
import { availableCurrency } from "../../balance/balance.types";

export class PaymentDto {
	@MaxLength(20)
	@IsNotEmpty()
	@IsString()
	title: string;

	@Min(0)
	@Max(1000000000)
	@IsNumber()
	price: number;

	@MaxLength(3)
	@IsString()
	currencyName: availableCurrency;

	@IsOptional()
	@Max(365)
	@IsNumber()
	period?: number;

	@IsOptional()
	@IsDateString()
	startDay?: Date;

	@MaxLength(20)
	@IsString()
	category: string;

	@IsString()
	type: payment;
}
