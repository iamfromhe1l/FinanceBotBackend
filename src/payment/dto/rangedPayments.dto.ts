import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { payment } from '../payment.type';

export class PaymentsListDto {
	@IsString()
	@IsNotEmpty()
	type: payment;

	@IsBoolean()
	@IsNotEmpty()
	periodic: boolean;
}
