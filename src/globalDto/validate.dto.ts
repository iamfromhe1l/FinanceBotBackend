import { IsEmail } from 'class-validator';

export class ValidateDto {
	@IsEmail()
	email: string;
}
