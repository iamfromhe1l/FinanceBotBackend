import {IsNumber} from 'class-validator';
import {availableCurrency} from "../../balance/names";

export class EditIdDebtsDto {
    @IsNumber()
    editedAmount: number;

    currency: availableCurrency;
}
