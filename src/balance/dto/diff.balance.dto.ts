import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
import { availableCurrency } from "../balance.types";

export class DiffBalanceDto {
    @IsNotEmpty()
    @Max(100000000)
    @Min(-100000000)
    @IsNumber()
    diff: number;

    @IsNotEmpty()
    // TODO Проверить что валюта существует c помощью валидатора
    currencyName: availableCurrency;
}
