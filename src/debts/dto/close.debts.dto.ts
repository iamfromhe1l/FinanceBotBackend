import {IsString} from 'class-validator';
import {ObjectId} from "mongoose";

export class CloseDebtsDto {
    @IsString()
    id: ObjectId;
}
