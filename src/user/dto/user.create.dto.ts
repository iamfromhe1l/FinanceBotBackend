import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
	@IsOptional()
	@MinLength(3)
	@MaxLength(12)
	@IsString()
	name?: string;

	@IsString()
	passwordHash: string;
}
