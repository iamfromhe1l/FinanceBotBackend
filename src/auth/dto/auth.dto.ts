import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString, MaxLength,
	MinLength,
} from "class-validator";

export class AuthDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(16)
	@IsString()
	password: string;

	@IsOptional()
	@MinLength(3)
	@MaxLength(12)
	@IsString()
	name?: string;
}
