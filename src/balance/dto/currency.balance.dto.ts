import { IsIn, IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { availableCurrency, availableCurrencysList } from "../balance.types";
import { balanceExceptions } from "../../common/exceptions/exception.constants";

export class ValueDto {
    @IsNotEmpty()
    @Min(1)
    @Max(1000000)
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsIn(availableCurrencysList, { message: balanceExceptions.CURRENCY_NOT_EXIST})
    currency: availableCurrency;
}