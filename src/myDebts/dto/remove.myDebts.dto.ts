import {IsString} from 'class-validator';
import {ValidateDto} from "../../globalDto/validate.dto";

export class RemoveMyDebtsDto extends ValidateDto {
    @IsString()
    name: string;

}

