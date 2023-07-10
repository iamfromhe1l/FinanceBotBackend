import {Injectable} from '@nestjs/common';
import {EditBalanceDto} from './dto/edit.balance.dto';
import {DiffBalanceDto} from './dto/diff.balance.dto';
import {UserService} from 'src/user/user.service';
import {Cron, CronExpression} from "@nestjs/schedule";
import {InjectModel} from "nestjs-typegoose";
import {UserModel} from "../user/user.model";
import {ReturnModelType} from "@typegoose/typegoose";
import {BalanceModel} from "./balance.model";
import {names} from "./names";

@Injectable()
export class BalanceService {
    constructor(
        @InjectModel(UserModel)
        private readonly userModel: ReturnModelType<typeof UserModel>,
        @InjectModel(BalanceModel)
        private readonly balanceModel: ReturnModelType<typeof BalanceModel>,
        private readonly userService: UserService
    ) {
    }

    async editBalance(
        email: string,
        dto: EditBalanceDto,
    ): Promise<{ balance: number }> {
        const user = await this.userService.findUser(email);
        user.balance = dto.editedBalance;
        await user.save();
        return {balance: user.balance};
    }

    async diffBalace(
        email: string,
        dto: DiffBalanceDto,
    ): Promise<{ balance: number }> {
        const user = await this.userService.findUser(email);
        user.balance += dto.diff;
        await user.save();
        return {balance: user.balance};
    }

    async getBalance(email: string): Promise<number> {
        return (await this.userService.findUser(email)).balance;
    }


    // New version

    async addCurrency(email: string,curr: string){
        const user = await this.userService.findUser(email);
        if (!user.listBalance.has(curr) && Object.keys(names).includes(curr)){
            user.listBalance.set(curr,0);
            await user.save();
            return true;
        }
        return false;
    }

    @Cron(CronExpression.EVERY_3_HOURS)
    async updateCurrenciesData() {
        const currencies = await fetch('https://openexchangerates.org/api/latest.json?app_id=f31efe911527419f9c314d915e958c0c', {method: 'GET', headers: {accept: 'application/json'}})
            .then(response => response.json())
            .catch(err => console.error(err));
        await this.balanceModel.deleteOne({});
        const data = new this.balanceModel({
        	"currencies": currencies.rates
        });
        await data.save();
    }

    getNames(){
        const data = JSON.stringify(names);
        return data;
    }

    async getCurrencies(){
        const curr = await this.balanceModel.find({});
        console.log(curr);
        const data = JSON.stringify(curr);
        return data;
    }
}
