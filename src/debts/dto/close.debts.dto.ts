import { IsMongoId, IsNotEmpty } from "class-validator";
import {Types} from 'mongoose';

export class CloseDebtsDto {
	@IsNotEmpty()
	@IsMongoId()
	id: Types.ObjectId;

}
