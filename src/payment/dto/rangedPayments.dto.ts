import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { payment } from '../payment.type';

export class PaymentsListDto {
	@IsNotEmpty()
	// TODO Проверить что валюта существует c помощью валидатора
	type: payment;

	@IsNotEmpty()
	@IsBoolean()
	periodic: boolean;
}
