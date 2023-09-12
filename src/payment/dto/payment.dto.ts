import {
	IsDateString, IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min, ValidateNested,
} from "class-validator";
import { payment, paymentEnum } from "../payment.type";
import { Type } from "class-transformer";
import { ValueDto } from "../../balance/dto/currency.balance.dto";

export class PaymentDto {
	@IsNotEmpty()
	@MaxLength(20)
	@IsString()
	title: string;

	@ValidateNested()
	@Type(() => ValueDto)
	value: ValueDto;

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
