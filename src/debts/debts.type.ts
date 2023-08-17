import { availableCurrency } from "../balance/balance.types";

export type debtType = 'me' | 'my';
// me  =  мне должны
// my  =  я должен

export type debtValue = {
    amount: number,
    currencyName: availableCurrency
}