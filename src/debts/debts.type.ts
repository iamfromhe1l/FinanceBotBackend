import { availableCurrency } from "../balance/balance.types";

export type debtHolderType = 'me' | 'my';
// me  =  мне должны
// my  =  я должен

export type debtValue = {
    amount: number,
    currencyName: availableCurrency
};

export enum DebtHolderEnum {
    me = 'me',
    my = 'my',
}
