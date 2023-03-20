import {IsString} from 'class-validator';
import {ValidateDto} from "../../globalDto/validate.dto";

export class RemoveDebtsToMeDto extends ValidateDto {
    @IsString()
    name: string;

}

