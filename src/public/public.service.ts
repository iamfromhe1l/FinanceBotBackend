import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PublicModel } from './public.model';
import { UserService } from "../user/user.service";
import { BalanceService } from "../balance/balance.service";

@Injectable()
export class PublicService {
    constructor(
        @InjectModel(PublicModel)
        private readonly publicModel: ReturnModelType<typeof PublicModel>,
        private readonly userService: UserService,
        private readonly balanceService: BalanceService,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_11PM)
    async updatePublicData() {
        const usersCount = await this.userService.getUsersCount();
        const currencies = await this.balanceService.getCurrencies();
        // TODO мб как то иначе получать эти данные, чтобы не делать популейт всей коллекции
        const users = await this.userService.getUCollectionWithPopulate();
        const total = {balance:0,debtsToMe: 0, myDebts: 0,incomes:0, expenses:0};
        users.forEach(el => {
            el.listBalance.forEach((v, k) => {
                total.balance += v / currencies.get(k);
            });
            el.debts.forEach((v) => {
                const value = v.value.amount / currencies.get(v.value.currency);
                v.type == 'me' ? total.debtsToMe += value : total.myDebts += value;
            });
            el.payments.forEach((v) => {
                const value = v.value.amount/currencies.get(v.value.currency);
                v.type == 'income' ? total.incomes += value : total.expenses += value;
            });
        });
        await this.publicModel.updateOne({},{
            usersCount,
            ...total
        });
    }

    async getPublicData() {
        // const doc: PublicModel = await this.publicModel.findOne({});
        // return {
        //     usersCount: doc.usersCount,
        //     totalBalance: doc.totalBalance,
        //     totalDebtsToMe: doc.totalDebtsToMe,
        //     totalMyDebts: doc.totalMyDebts,
        //     totalIncomes: doc.totalIncomes,
        //     totalExpenses: doc.totalExpenses,
        // };
        return this.publicModel.findOne({});
    }
}
