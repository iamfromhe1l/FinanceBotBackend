import { IsString } from 'class-validator';

export class RemoveDebtsToMeDto {
	@IsString()
	name: string;
}
