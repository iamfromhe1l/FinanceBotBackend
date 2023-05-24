import { IsNumber, Max } from 'class-validator';

export class DiffBalanceDto {
	@Max(1000000000)
	@IsNumber()
	diff: number;
}
