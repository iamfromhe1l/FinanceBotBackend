import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface MyDebtsModel extends Base {}
export class MyDebtsModel extends TimeStamps {

    @prop()
    email: string;

    @prop({ default: "Че тут писать" })
    name: string;

    @prop({ default: 0 })
    amount: number;

}