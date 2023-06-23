import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface IncomeModel extends Base {}
export class IncomeModel extends TimeStamps {
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

	// Next income Date
	@prop({ type: () => Date })
	nextDate?: Date;

	@prop({ type: () => Date, required: true })
	incomeDate: Date;

	@prop({ type: () => Date })
	lastDate?: Date;
}
