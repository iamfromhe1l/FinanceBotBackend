import {
	IsNotEmpty,
	IsNumber,
	IsString,
	Max,
	MaxLength,
} from 'class-validator';
import { ValidateDto } from 'src/globalDto/validate.dto';

export class IncomeDto extends ValidateDto {
	@MaxLength(20)
	@IsNotEmpty()
	@IsString()
	title: string;

	@Max(1000000000)
	@IsNumber()
	price: number;

	@Max(365)
	@IsNumber()
	period: number;

	@MaxLength(20)
	@IsString()
	category: string;
}
