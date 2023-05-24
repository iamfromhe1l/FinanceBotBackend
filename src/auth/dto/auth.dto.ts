import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength,
} from 'class-validator';

export class AuthDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@MinLength(8)
	@IsNotEmpty()
	@IsString()
	password: string;

	@IsOptional()
	@IsString()
	name?: string;
}
