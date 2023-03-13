import {IsEmail} from 'class-validator';

export class GetTotalMyDebtsDto {
    @IsEmail()
    email: string;

}