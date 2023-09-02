import { availableCurrency } from "../balance/balance.types";

export type payment = 'income' | 'expense';

export type editBalanceByPaymentType = { price: number; currencyName: availableCurrency; type: payment; }