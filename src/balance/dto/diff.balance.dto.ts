import {IsNumber, IsString, Max} from 'class-validator';

export class DiffBalanceDto {
    @Max(1000000000)
    @IsNumber()
    diff: number;

    @IsString()
    currencyName: string;
}
