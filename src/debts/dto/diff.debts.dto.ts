import {IsNumber} from 'class-validator';
import { Types } from "mongoose";

export class DiffDebtsDto {
    @IsNumber()
    diff: number;

    id: Types.ObjectId;
}
