import {IsNumber, IsString} from 'class-validator';

export class Edit2BalanceDto {
    @IsString()
    currencyName: string;

    @IsNumber()
    editedBalance: number;
}