import {prop} from '@typegoose/typegoose';
import {Base, TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import {Types} from 'mongoose';
import {IncomeModel} from 'src/income/income.model';
import {MyDebtsModel} from '../myDebts/myDebts.model';
import {DebtsToMeModel} from '../debtsToMe/debtsToMe.model';


export interface UserModel extends Base {
}

export class UserModel extends TimeStamps {
    @prop({unique: true, required: true})
    email: string;

    @prop({type: () => String, required: true})
    passwordHash: string;

    // Refresh jwt token
    @prop({type: () => String})
    hashRt: string;

    @prop({type: () => String})
    name: string;

    @prop({default:{"RUS": 0}})
    listBalance: Map<string,number>;

    @prop({default: 0})
    balance: number;

    @prop({type: () => Types.ObjectId, ref: () => IncomeModel})
    incomes: IncomeModel[];

    @prop({type: () => Types.ObjectId})
    expenses: Types.ObjectId[];

    @prop({type: () => Types.ObjectId, ref: () => MyDebtsModel})
    myDebts: MyDebtsModel[];

    @prop({type: () => Types.ObjectId, ref: () => DebtsToMeModel})
    debtsToMe: DebtsToMeModel[];
}
