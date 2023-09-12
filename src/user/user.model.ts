import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';
import { PaymentModel } from 'src/payment/payment.model';
import { DebtsModel } from '../debts/debts.model';

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
	@prop({ unique: true, required: true })
	email: string;

	@prop({ type: () => String, required: true })
	passwordHash: string;

	@prop({ type: () => String })
	hashRt: string;

	@prop({ type: () => String })
	name: string;

	@prop({ required: true})
	listBalance: Map<string, number>;

	@prop({ type: () => Types.ObjectId, ref: () => PaymentModel })
	payments: PaymentModel[];

	@prop({ type: () => Types.ObjectId, ref: () => DebtsModel })
	debts: DebtsModel[];
}
