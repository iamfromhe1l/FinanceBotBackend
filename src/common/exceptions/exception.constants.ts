
export enum commonExceptions {
	AUTHORIZATION_ERROR = 'Email в запросе и email найденного документа не совпадают',
}

export enum balanceExceptions {
	CURRENCY_NOT_EXIST = 'Валюта с таким названием не существует',
	BALANCE_DONT_HAS_CURRENCY = 'В балансе нет такой валюты',
	LESS_THAN_ZERO = 'Баланс изменяемой валюты меньше нуля',
}

export enum paymentExceptions {
	PAYMENT_SCHEDULE_STOPPED = 'Повторение платежа уже остановлено',
	PAYMENT_NOT_EXIST = 'Payment с таким id не существует',
}

export enum debtsExceptions {
    DEBT_NOT_EXIST = 'Debt с таким id не существует'
}