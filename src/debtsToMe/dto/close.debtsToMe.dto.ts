import {IsString} from 'class-validator';
import {ObjectId} from "mongoose";

export class CloseDebtsToMeDto {
    @IsString()
    id: ObjectId;
}
