import {
	IsNotEmpty,
	IsNumber, IsOptional,
	IsString,
	Max,
	MaxLength,
} from 'class-validator';
import {payment} from "../payment.type";

export class PaymentDto {
	@MaxLength(20)
	@IsNotEmpty()
	@IsString()
	title: string;

	@Max(1000000000)
	@IsNumber()
	price: number;

	@IsOptional()
	@Max(365)
	@IsNumber()
	period?: number;

	@MaxLength(20)
	@IsString()
	category: string;

	@IsString()
	type: payment;
}
