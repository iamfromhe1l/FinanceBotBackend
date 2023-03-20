import {IsNumber, IsString} from 'class-validator';
import {ValidateDto} from "../../globalDto/validate.dto";

export class AddMyDebtsDto extends ValidateDto {
    @IsString()
    name: string;

    @IsNumber()
    amount: number;
}

