import {IsEmail, IsNumber, IsString} from 'class-validator';

export class RemoveMyDebtsDto {
    @IsEmail()
    email: string;

    @IsString()
    name: string;

}

