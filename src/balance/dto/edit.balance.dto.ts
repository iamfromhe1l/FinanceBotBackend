import {IsNumber, IsString, Min} from 'class-validator';

export class EditBalanceDto {
    @IsString()
    currencyName: string;

    @IsNumber()
    @Min(0)
    editedBalance: number;
}