import { IsString } from 'class-validator';

export class RemoveDebtsDto {
	@IsString()
	name: string;
}
