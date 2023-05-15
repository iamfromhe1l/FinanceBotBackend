import { IsString } from 'class-validator';
import { ValidateDto } from 'src/globalDto/validate.dto';

export class CreateUserDto extends ValidateDto {
	@IsString()
	name: string;

	@IsString()
	passwordHash: string;
}
