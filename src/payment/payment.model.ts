import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { payment } from './payment.type';

export interface PaymentModel extends Base {}
export class PaymentModel extends TimeStamps {
	@prop({ type: () => String, required: true })
	email: string;

	@prop({ type: () => String, required: true })
	title: string;

	@prop({ type: () => Number, required: true })
	price: number;

	@prop({ type: () => String, default: 'main' })
	category: string;

	// In days
	@prop({ type: () => Number })
	period?: number;

	// Next payment Dat
	@prop({ type: () => Date })
	nextDate?: Date;

	@prop({ type: () => Date, required: true })
	paymentDate: Date;

	@prop({ type: () => Date })
	lastDate?: Date;

	@prop({ required: true })
	type: payment;
}
