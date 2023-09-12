import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { availableCurrency } from "./balance.types";


export interface BalanceModel extends Base {}
export class BalanceModel extends TimeStamps {

    @prop({ required: true, default: "RUB" })
    base: availableCurrency;

    @prop({ required: true, default: Map<string,number> })
    rates: Map<string, number>;

}