import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { payment } from './payment.type';
import { value } from "../balance/balance.types";

export interface PaymentModel extends Base {}
export class PaymentModel extends TimeStamps {
	@prop({ type: () => String, required: true })
	email: string;

	@prop({ type: () => String, required: true })
	title: string;

	@prop({ required: true })
	value: value;

	@prop({ type: () => String, default: 'main' })
	category: string;

	@prop({ type: () => Number })
	period?: number;

	@prop({ type: () => Date })
	nextDate?: Date;

	@prop({ type: () => Date })
	lastDate?: Date;

	@prop({ required: true })
	type: payment;
}
