import { IsString } from 'class-validator';

export class RemoveMyDebtsDto {
	@IsString()
	name: string;
}
