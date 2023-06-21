import {Injectable} from "@nestjs/common";
import {InjectModel} from "nestjs-typegoose";
import {UserModel} from "../user/user.model";
import {ReturnModelType} from "@typegoose/typegoose";
import {Cron, CronExpression} from "@nestjs/schedule";
import {PublicModel} from "./public.model";


@Injectable()
export class PublicService {
    constructor(
        @InjectModel(UserModel)
        private readonly userModel: ReturnModelType<typeof UserModel>,
        @InjectModel(PublicModel)
        private readonly publicModel: ReturnModelType<typeof PublicModel>,
    ) {
    }

    @Cron(CronExpression.EVERY_DAY_AT_11PM)
    // @Cron(CronExpression.EVERY_5_SECONDS)
    async updatePublicData() {
        const usersCount = await this.userModel.countDocuments();
        const users = await this.userModel.find().populate([
            {path: 'incomes'},
            {path: 'expenses'},
            {path: 'myDebts'},
            {path: 'debtsToMe'}
        ]).exec();
        let totalBalance=0, totalDebtsToMe=0, totalMyDebts=0;
        users.forEach((el) => {
            totalBalance += el.balance;
            totalDebtsToMe += el.debtsToMe.reduce((acc,v) => acc+=v.amount,0);
            totalMyDebts += el.myDebts.reduce((acc,v) => acc+=v.amount,0);
        });
        await this.publicModel.deleteOne({});
        const data = new this.publicModel({
            usersCount,
            totalBalance,
            totalDebtsToMe,
            totalMyDebts
        });
        await data.save();
        return data;
    }

    async getPublicData(){
        const doc: PublicModel = await this.publicModel.findOne({});
        return {
            usersCount:doc.usersCount,
            totalBalance:doc.totalBalance,
            totalDebtsToMe:doc.totalDebtsToMe,
            totalMyDebts:doc.totalMyDebts,

        };
    }
}