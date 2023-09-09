import { IsBoolean, IsEnum, IsNotEmpty } from "class-validator";
import { payment, paymentEnum } from "../payment.type";

export class PaymentsListDto {
	@IsNotEmpty()
	@IsEnum(paymentEnum)
	type: payment;

	@IsNotEmpty()
	@IsBoolean()
	periodic: boolean;
}
