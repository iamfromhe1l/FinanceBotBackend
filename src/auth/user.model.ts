import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
	@prop({ unique: true, required: true })
	email: string;

	@prop({ type: () => String, required: true })
	passwordHash: string;

	@prop({ default: 0 })
	balance: number;

	@prop({ type: () => Array<string> })
	tgID: string[];

	// Доходы
	@prop({ type: () => Array<Types.ObjectId> })
	income: Types.ObjectId[];

	// Расходы
	@prop({ type: () => Array<Types.ObjectId> })
	expenses: Types.ObjectId[];

	// Должен user
	@prop({ type: () => Array<Types.ObjectId> })
	owe: Types.ObjectId[];

	// Должны user'у
	@prop({ type: () => Array<Types.ObjectId> })
	oweMe: Types.ObjectId[];
}
