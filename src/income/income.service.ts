import { Injectable } from '@nestjs/common';
import { IncomeDto } from './dto/Income.dto';
import { InjectModel } from 'nestjs-typegoose';
import { IncomeModel } from './income.model';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class IncomeService {
	constructor(
		@InjectModel(IncomeModel)
		private readonly incomeModel: ReturnModelType<typeof IncomeModel>,
	) {}
	async createIncome(dto: IncomeDto) {
		const currentDate: Date = new Date();
		const newIncome = new this.incomeModel({
			title: dto.title,
			price: dto.price,
			category: dto.category,
			period: dto.period,
			nextDate: currentDate.setDate(currentDate.getDate() + dto.period),
		});
		return newIncome.save();
	}
}
