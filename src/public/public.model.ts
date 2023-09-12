import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface PublicModel extends Base {}
export class PublicModel extends TimeStamps {

    @prop({ type: () => Number, required: true })
    usersCount: number;

    @prop({ type: () => Number, required: true })
    totalDebtsToMe: number;

    @prop({ type: () => Number, required: true })
    totalMyDebts: number;

    @prop({ type: () => Number, required: true })
    totalBalance: number;

    @prop({ type: () => Number, required: true })
    totalIncomes: number;

    @prop({ type: () => Number, required: true })
    totalExpenses: number;

}