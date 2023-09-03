import { IsMongoId, IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { Types } from "mongoose";

export class EditDebtsDto {
    @IsNotEmpty()
    @Min(1)
    @Max(100000000)
    @IsNumber()
    editedAmount: number;

    @IsNotEmpty()
    @IsMongoId()
    id: Types.ObjectId;
}
