import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { debtHolderType } from "./debts.type";
import { value } from "../balance/balance.types";

export interface DebtsModel extends Base {}
export class DebtsModel extends TimeStamps {

	@prop({ type: () => String, required: true })
	email: string;

	@prop({ type: () => String, required: true })
	name: string;

	@prop({required:true})
	value: value;

	@prop({ required: true })
	type: debtHolderType;

	@prop({ type: () => Boolean,required: true })
	editBalance: boolean;

	// isFixed==false => курс меняется, валюта зафиксирована. Например открыли долг на 100$,
	// закрываем также на 100, но по новому курсу.
	// --------------------------
	// isFixed==true  => курс зафиксирован, валюта меняется. Например открыли долг на 100$ по 60 рублей,
	// закрываем долг 6000 рублей вне зависимости от курса $ на момент закрытия. В value храним данные
	// в нужной валюте, oldValue в базовой валюте
	@prop({ type: () => Boolean, required: true })
	isFixed: boolean;

	//Ставить только если isFixed==true
	@prop()
	oldValue?: value;

	@prop({ type: () => Boolean })
	isClosed?: boolean;

}
