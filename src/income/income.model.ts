import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface IncomeModel extends Base {}
export class IncomeModel extends TimeStamps {
	@prop()
	title: string;

	@prop()
	price: number;

	@prop()
	category: string;

	// In days
	@prop()
	period: number;

	// Next income Date
	@prop()
	nextDate: Date;
}
