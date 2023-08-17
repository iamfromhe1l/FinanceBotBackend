import {IsNumber} from 'class-validator';
import {availableCurrency} from "../../balance/balance.types";
import { Types } from "mongoose";

export class EditDebtsDto {
    @IsNumber()
    editedAmount: number;

    //не нужно, теперь разные валюты хранятся в разных документах
    currency: availableCurrency;

    id: Types.ObjectId;
}
