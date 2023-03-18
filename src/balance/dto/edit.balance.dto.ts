import { IsNumber } from 'class-validator';
import { ValidateDto } from 'src/globalDto/validate.dto';

export class EditBalanceDto extends ValidateDto {
	@IsNumber()
	editedBalance: number;
}
