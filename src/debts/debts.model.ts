import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { debt } from './debts.type';
import {availableCurrency} from "../balance/balance.types";

export interface DebtsModel extends Base {}
export class DebtsModel extends TimeStamps {

	// Мб все долги одного пользователя хранить в одном документе, не разделяя на тип долга
	// А в поле debtsList будут объекты у которых есть поля "debtType" "fixedCurrency" и тд

	@prop({ type: () => String, required: true })
	email: string;

	@prop({ type: () => String, required: true })
	name: string;

	@prop({required: true})
	listDebts: Map<availableCurrency, number>;

	@prop({ required: true })
	editBalance: boolean;

	@prop({ type: () => Date, required: true })
	debtDate: Date;

	@prop({ type: () => Boolean })
	isClosed?: boolean;

	@prop({ required: true })
	type: debt;


	// isFixed==true  => зафиксирована валюта, курс меняется
	// isFixed==false => зафиксирован курс
	isFixed: boolean;

	//Ставить только если isFixed==false
	fixedCurrencies?: Map<availableCurrency,number>;

}
