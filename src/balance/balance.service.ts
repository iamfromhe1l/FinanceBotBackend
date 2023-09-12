import {Injectable} from '@nestjs/common';
import {UserService} from 'src/user/user.service';
import {Cron, CronExpression} from "@nestjs/schedule";
import {InjectModel} from "nestjs-typegoose";
import {UserModel} from "../user/user.model";
import {ReturnModelType} from "@typegoose/typegoose";
import {BalanceModel} from "./balance.model";
import {balanceTypes, namesType} from "./balance.types";
import {EditBalanceDto} from "./dto/edit.balance.dto";
import {DiffBalanceDto} from "./dto/diff.balance.dto";
import {balanceExceptions} from "../common/exceptions/exception.constants";
import {ServiceException} from "../common/exceptions/serviceException";


@Injectable()
export class BalanceService {
    constructor(
        @InjectModel(BalanceModel)
        private readonly balanceModel: ReturnModelType<typeof BalanceModel>,
        private readonly userService: UserService
    ) {
    }

    // TODO Вместо проверки в функциях, проверять условие в интерсепторе для всех запросов где используются разные валюты
    isCurrencyExist(newBase : string): void{
        const flag =  Object.keys(balanceTypes).includes(newBase);
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
        if (!user.listBalance.has(newBase)){
            user.listBalance.set(newBase,0);
            await user.save();
            return true;
        }
        return false;
    }


    // TODO переписать через update
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
        return balanceTypes;
    }

    async getCurrencies(newBase?: string): Promise<Map<string,number>>{
        const curr = await this.balanceModel.findOne({});
        if (newBase) {
            const a = this.changeBaseCurrency(curr.currencies, newBase);
            return a;
        }
        return curr.currencies;
    }

    async getBalance(email: string): Promise<Map<string,number>>{
        const user = await this.userService.findUser(email);
        return user.listBalance;
    }

    async editBalance(
        email: string,
        dto: EditBalanceDto,
    ): Promise<Map<string,number>> {
        this.isCurrencyExist(dto.currencyName);
        const user = await this.userService.findUser(email);
        if (!user.listBalance.has(dto.currencyName)) throw new ServiceException(balanceExceptions.BALANCE_DONT_HAS_CURRENCY);
        user.listBalance.set(dto.currencyName,dto.editedBalance);
        await user.save();
        return user.listBalance;
    }

    async diffBalance(
        email: string,
        dto: DiffBalanceDto,
    ): Promise<Map<string,number>> {
        this.isCurrencyExist(dto.currencyName);
        console.log(email)
        const user = await this.userService.findUser(email);
        console.log(user)
        if (!user.listBalance.has(dto.currencyName)) throw new ServiceException(balanceExceptions.BALANCE_DONT_HAS_CURRENCY);

        const newValue = user.listBalance.get(dto.currencyName) + dto.diff;
        if (newValue < 0) throw new ServiceException(balanceExceptions.LESS_THAN_ZERO);
        user.listBalance.set(dto.currencyName,newValue);
        await user.save();
        return user.listBalance;
    }
}
