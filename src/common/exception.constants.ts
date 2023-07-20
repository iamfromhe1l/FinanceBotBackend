export enum balanceExceptions {
	CURRENCY_NOT_EXIST = 'Валюта с таким названием не существует',
	LESS_THAN_ZERO = 'Баланс изменяемой валюты меньше нуля',
}

export enum paymentExceptions {
	EMAIL_AUTHORIZATION_ERROR = 'Email payment-а и AuthEmail не совпадают',
	PAYMENT_NOT_EXIST = 'Payment-а с таким id не существует',
}
