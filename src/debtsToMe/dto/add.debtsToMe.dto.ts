import {IsNumber, IsString} from 'class-validator';
import {ValidateDto} from "../../globalDto/validate.dto";

export class AddDebtsToMeDto extends ValidateDto {
    @IsString()
    name: string;

    @IsNumber()
    amount: number;
}

