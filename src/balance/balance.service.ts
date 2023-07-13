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
import {Edit2BalanceDto} from "./dto/edit2.balance.dto";
import {Diff2BalanceDto} from "./dto/diff2.balance.dto";


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

    async diffBalance(
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


    // ------------------------------- New version ---------------------------------------

    isCurrencyExist(newBase:string):  boolean{
        return Object.keys(names).includes(newBase);
    }

    // При каждом обновлении курсов меняем базовую валюту на рубли в кроне.
    // Если у пользователя выбрана другая базовая валюта, то при каждом запросе на баланс
    // Происходит смена базовой валюты на нужную.
    changeBaseCurrency(rates: Map<string,number>,newBase: string):Map<string,number> | number{
        if (!this.isCurrencyExist(newBase)) return -1;
        const baseCurrency = rates.get(newBase);
        const newRates = new Map<string,number>;
        rates.forEach((value,key) => {
            if (key != newBase){
                newRates.set(key,value / baseCurrency);
            }else {
                newRates.set(key,1);
            }
        });
        return newRates;
    }

    async addCurrency(email: string,newBase: string): Promise<boolean>{
        const user = await this.userService.findUser(email);
        if (!user.listBalance.has(newBase) && this.isCurrencyExist(newBase)){
            user.listBalance.set(newBase,0);
            await user.save();
            return true;
        }
        return false;
    }

    @Cron(CronExpression.EVERY_3_HOURS)
    async updateCurrenciesData(): Promise<void> {
        const currencies = await fetch('https://openexchangerates.org/api/latest.json?app_id=f31efe911527419f9c314d915e958c0c',
            {method: 'GET', headers: {accept: 'application/json'}})
            .then(response => response.json())
            .catch(err => console.error(err));
        await this.balanceModel.deleteOne({});
        const rates = new Map<string,number>;
        Object.keys(currencies.rates).forEach(key => {
            rates.set(key, currencies.rates[key]);
        });
        const newRates = this.changeBaseCurrency(rates,'RUB');
        const data = new this.balanceModel({
        	"currencies": newRates
        });
        await data.save();
    }


    // TODO Добавить русские названия валют
    getNames(): string{
        return JSON.stringify(names);
    }

    async getCurrencies(newBase?:string): Promise<string>{
        const curr = await this.balanceModel.find({});
        console.log(newBase);
        if (newBase && this.isCurrencyExist(newBase)){
            const data = this.changeBaseCurrency(curr[0].currencies,newBase) as Map<string,number>;
            // console.log(await JSON.stringify(data));
            return JSON.stringify([...data]);
        }
        return JSON.stringify([...curr[0].currencies]);
        // return curr[0].currencies;
    }

    async getBalance2(email: string): Promise<Map<string,number>>{
        const user = await this.userService.findUser(email);
        return user.listBalance;
    }

    async editBalance2(
        email: string,
        dto: Edit2BalanceDto,
    ): Promise<number | Map<string,number>> {
        if (this.isCurrencyExist(dto.currencyName)) return  -1;
        const user = await this.userService.findUser(email);
        user.listBalance.set(dto.currencyName,dto.editedBalance);
        await user.save();
        return user.listBalance;
    }

    async diffBalance2(
        email: string,
        dto: Diff2BalanceDto,
    ): Promise<number | Map<string,number>> {
        if (this.isCurrencyExist(dto.currencyName)) return  -1;
        const user = await this.userService.findUser(email);
        const newValue = user.listBalance.get(dto.currencyName) + dto.diff;
        user.listBalance.set(dto.currencyName,newValue);
        await user.save();
        return user.listBalance;
    }
}
