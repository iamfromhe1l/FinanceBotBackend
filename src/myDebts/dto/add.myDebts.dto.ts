import {IsEmail, IsNumber, IsString} from 'class-validator';

export class AddMyDebtsDto {
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsNumber()
    amount: number;
}

