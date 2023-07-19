import {Injectable} from '@nestjs/common';
import {UserService} from 'src/user/user.service';
import {Cron, CronExpression} from "@nestjs/schedule";
import {InjectModel} from "nestjs-typegoose";
import {UserModel} from "../user/user.model";
import {ReturnModelType} from "@typegoose/typegoose";
import {BalanceModel} from "./balance.model";
import {names, namesType} from "./names";
import {EditBalanceDto} from "./dto/edit.balance.dto";
import {DiffBalanceDto} from "./dto/diff.balance.dto";
import {balanceExceptions} from "../common/exceptions/exception.constants";
import {ServiceException} from "../common/exceptions/serviceException";


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

    // TODO Вместо проверки в функциях, проверять условие в интерсепторе для всех запросов где используются разные валюты
    isCurrencyExist(newBase:string): void{
        const flag =  Object.keys(names).includes(newBase);
        if (!flag) throw new ServiceException(balanceExceptions.CURRENCY_NOT_EXIST);
    }

    changeBaseCurrency(rates: Map<string,number>,newBase: string):Map<string,number>{
        this.isCurrencyExist(newBase);
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
        this.isCurrencyExist(newBase);
        const user = await this.userService.findUser(email);
        if (!user.listBalance.currencies.has(newBase)){
            user.listBalance.currencies.set(newBase,0);
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
    getNames(): namesType{
        return names;
    }

    async getCurrencies(newBase?:string): Promise<Map<string,number>>{
        this.isCurrencyExist(newBase);
        const curr = await this.balanceModel.findOne({});
        if (newBase)
            return this.changeBaseCurrency(curr.currencies,newBase);
        return curr.currencies;
    }

    async getBalance(email: string): Promise<Map<string,number>>{
        const user = await this.userService.findUser(email);
        return user.listBalance.currencies;
    }


    // TODO  Проверка в дтошке что новый баланс больше нуля
    async editBalance(
        email: string,
        dto: EditBalanceDto,
    ): Promise<Map<string,number>> {
        this.isCurrencyExist(dto.currencyName);
        const user = await this.userService.findUser(email);
        user.listBalance.currencies.set(dto.currencyName,dto.editedBalance);
        await user.save();
        return user.listBalance.currencies;
    }

    async diffBalance(
        email: string,
        dto: DiffBalanceDto,
    ): Promise<Map<string,number>> {
        this.isCurrencyExist(dto.currencyName);
        const user = await this.userService.findUser(email);
        const newValue = user.listBalance.currencies.get(dto.currencyName) + dto.diff;
        if (newValue < 0) throw new ServiceException(balanceExceptions.LESS_THAN_ZERO);
        user.listBalance.currencies.set(dto.currencyName,newValue);
        await user.save();
        return user.listBalance.currencies;
    }
}
