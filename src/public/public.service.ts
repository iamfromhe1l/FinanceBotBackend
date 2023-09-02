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
        let totalBalance = 0, totalDebtsToMe = 0, totalMyDebts = 0;
        users.forEach(el => {
            el.listBalance.currencies.forEach((v, k) => {
                totalBalance += v / currencies.get(k);
            });
            el.debts.forEach((v) => {
                const value = v.value.amount / currencies.get(v.value.currencyName);
                v.type == 'me' ? totalDebtsToMe += value : totalMyDebts += value;
            });
        });
        await this.publicModel.updateOne({},{
            usersCount,
            totalBalance,
            totalDebtsToMe,
            totalMyDebts,
        });
    }

    async getPublicData() {
        const doc: PublicModel = await this.publicModel.findOne({});
        return {
            usersCount: doc.usersCount,
            totalBalance: doc.totalBalance,
            totalDebtsToMe: doc.totalDebtsToMe,
            totalMyDebts: doc.totalMyDebts,
        };
    }
}
