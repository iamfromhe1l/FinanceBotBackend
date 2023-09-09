import { IsIn, IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { availableCurrency, availableCurrencysList } from "../balance.types";
import { balanceExceptions } from "../../common/exceptions/exception.constants";

export class EditBalanceDto {

    @IsNotEmpty()
    @IsIn(availableCurrencysList, { message: balanceExceptions.CURRENCY_NOT_EXIST})
    currencyName: availableCurrency;

    @IsNotEmpty()
    @Min(0)
    @Max(100000000)
    @IsNumber()
    editedBalance: number;
}