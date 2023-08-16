import {IsNumber} from 'class-validator';
import {availableCurrency} from "../../balance/balance.types";

export class EditIdDebtsDto {
    @IsNumber()
    editedAmount: number;

    currency: availableCurrency;
}
