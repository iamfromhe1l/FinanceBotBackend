import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface DebtsToMeModel extends Base {}
export class DebtsToMeModel extends TimeStamps {

    @prop({type: () => String, required: true})
    email: string;

    @prop({ type: () => String, required: true })
    name: string;

    @prop({ type: () => Number, required: true })
    amount: number;

    @prop({ type: () => Date, required: true })
    debtDate: Date;

}