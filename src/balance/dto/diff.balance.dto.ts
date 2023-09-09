import { IsIn, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { availableCurrency, availableCurrencysList } from "../balance.types";
import { balanceExceptions } from "../../common/exceptions/exception.constants";

export class DiffBalanceDto {
    @IsNotEmpty()
    @Max(100000000)
    @Min(-100000000)
    @IsNumber()
    diff: number;

    @IsNotEmpty()
    @IsIn(availableCurrencysList, { message: balanceExceptions.CURRENCY_NOT_EXIST})
    currencyName: availableCurrency;
}
