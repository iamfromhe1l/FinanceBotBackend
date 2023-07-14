import { IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { debt } from '../debts.type';

export class CloseDebtsDto {
	@IsString()
	id: ObjectId;

	debtType: debt;
}
