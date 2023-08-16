import { IsString } from 'class-validator';
import {Types} from 'mongoose';

export class CloseDebtsDto {
	@IsString()
	id: Types.ObjectId;

}
