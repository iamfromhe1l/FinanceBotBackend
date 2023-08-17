import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { debtValue, debtType } from "./debts.type";

export interface DebtsModel extends Base {}
export class DebtsModel extends TimeStamps {

	@prop({ type: () => String, required: true })
	email: string;

	@prop({ type: () => String, required: true })
	name: string;

	@prop({required:true})
	value: debtValue;

	@prop({ required: true })
	editBalance: boolean;

	@prop({ type: () => Date, required: true })
	debtDate: Date;

	@prop({ type: () => Boolean })
	isClosed?: boolean;

	@prop({ required: true })
	type: debtType;

	// isFixed==false => курс меняется, валюта зафиксирована. Например открыли долг на 100$,
	// закрываем также на 100, но по новому курсу.
	// --------------------------
	// isFixed==true  => курс зафиксирован, валюта меняется. Например открыли долг на 100$ по 60 рублей,
	// закрываем долг 6000 рублей вне зависимости от курса $ на момент закрытия. В value храним данные
	// в базовой валюте, oldValue в нужной валюте
	@prop({ required: true })
	isFixed: boolean;

	//Ставить только если isFixed==true
	@prop({ required: true })
	oldValue?: debtValue;

}
