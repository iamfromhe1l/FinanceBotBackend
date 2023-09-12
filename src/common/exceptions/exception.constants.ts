export enum balanceExceptions {
	CURRENCY_NOT_EXIST = 'Валюта с таким названием не существует',
	BALANCE_DONT_HAS_CURRENCY = 'В балансе нет такой валюты',
	LESS_THAN_ZERO = 'Баланс изменяемой валюты меньше нуля',
}

export enum paymentExceptions {

	// TODO вынести в отдельную ошибку случай когда authEmail не совпадает с email в payment, debt и тд
	EMAIL_AUTHORIZATION_ERROR = 'Email payment-а и AuthEmail не совпадают',
	WHAT_ERROR_IS_IT = 'Посмотри пеже че тут должно быть',
	CANT_DELETE_PAYMENT = 'Невозможно удалить payment, так как он не существует',
	PAYMENT_NOT_EXIST = 'Payment-а с таким id не существует',
}

export enum debtsExceptions {
    DEBT_NOT_EXIST = 'Выбранного долга не существует'
}