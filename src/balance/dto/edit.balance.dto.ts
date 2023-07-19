import {IsNumber, IsString} from 'class-validator';

export class EditBalanceDto {
    @IsString()
    currencyName: string;

    @IsNumber()
    editedBalance: number;
}