import { IsMongoId, IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { Types } from "mongoose";

export class DiffDebtsDto {
    @IsNotEmpty()
    @Min(-100000000)
    @Max(100000000)
    @IsNumber()
    diff: number;

    @IsNotEmpty()
    @IsMongoId()
    id: Types.ObjectId;
}
