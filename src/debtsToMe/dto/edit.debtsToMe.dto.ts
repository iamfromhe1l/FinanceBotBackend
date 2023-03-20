import {IsNumber, IsString} from 'class-validator';
import {ValidateDto} from "../../globalDto/validate.dto";

export class EditDebtsToMeDto extends ValidateDto {
    @IsString()
    name: string;

    @IsNumber()
    editedAmount: number;
}
