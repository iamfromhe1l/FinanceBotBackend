import { Injectable } from '@nestjs/common';
import { IncomeDto } from './dto/Income.dto';
import { InjectModel } from 'nestjs-typegoose';
import { IncomeModel } from './income.model';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class IncomeService {
	constructor(
		@InjectModel(IncomeModel)
		private readonly incomeModule: ReturnModelType<typeof IncomeModel>,
	) {}
}
