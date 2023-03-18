import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';
import { IncomeModel } from 'src/income/income.model';

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
	@prop({ unique: true, required: true })
	email: string;

	@prop({ type: () => String, required: true })
	passwordHash: string;

	@prop({ default: 0 })
	balance: number;

	@prop({ type: String })
	tgID: string[];

	// Доходы
	@prop({ type: () => Types.ObjectId, ref: () => IncomeModel })
	incomes: Types.ObjectId[];

	// Расходы
	@prop({ type: () => Types.ObjectId })
	expenses: Types.ObjectId[];

	@prop({ default: [] })
	myDebts: Types.ObjectId[];

	// Должны user'у
	@prop({ type: () => Types.ObjectId })
	oweMe: Types.ObjectId[];
}
