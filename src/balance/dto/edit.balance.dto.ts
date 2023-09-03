import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { availableCurrency } from "../balance.types";

export class EditBalanceDto {

    @IsNotEmpty()
    // TODO Проверить что валюта существует c помощью валидатора
    currencyName: availableCurrency;

    @IsNotEmpty()
    @Min(0)
    @Max(100000000)
    @IsNumber()
    editedBalance: number;
}