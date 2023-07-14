import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { debt } from './debts.type';

export interface DebtsModel extends Base {}
export class DebtsModel extends TimeStamps {
	@prop({ type: () => String, required: true })
	email: string;

	@prop({ type: () => String, required: true })
	name: string;

	@prop({ type: () => Number, required: true })
	amount: number;

	@prop({ type: () => Date, required: true })
	debtDate: Date;

	@prop({ type: () => Boolean })
	isClosed?: boolean;

	@prop({ required: true })
	type: debt;
}
