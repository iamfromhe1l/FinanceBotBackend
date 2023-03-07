import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
	@prop({ unique: true })
	email: string;

	@prop()
	passwordHash: string;

	@prop({ default: 0 })
	balance: number;

	@prop({ default: [] })
	tgID: string[];

	// Доходы
	@prop({ default: [] })
	income: Types.ObjectId[];

	// Расходы
	@prop({ default: [] })
	expenses: Types.ObjectId[];

}
