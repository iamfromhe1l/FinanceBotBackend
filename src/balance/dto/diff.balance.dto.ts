import { IsNumber, Max } from 'class-validator';
import { ValidateDto } from 'src/globalDto/validate.dto';

export class DiffBalanceDto extends ValidateDto {
	@Max(1000000000)
	@IsNumber()
	diff: number;
}
