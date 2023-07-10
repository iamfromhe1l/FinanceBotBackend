import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';


export interface BalanceModel extends Base {}
export class BalanceModel extends TimeStamps {

    @prop({ required: true })
    currencies: Map<string, number>;


}