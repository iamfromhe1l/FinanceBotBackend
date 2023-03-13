import { IsEmail, IsString, Min } from 'class-validator';

export class AuthDto {
	@IsEmail()
	email: string;

	@Min(8)
	@IsString()
	password: string;

	@IsString()
	tgID?: string;
}
