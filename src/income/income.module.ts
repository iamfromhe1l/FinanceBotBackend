import { Module } from '@nestjs/common';
import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { IncomeModel } from './income.model';

@Module({
	imports: [
		ConfigModule,
		TypegooseModule.forFeature([
			{
				typegooseClass: IncomeModel,
				schemaOptions: {
					collection: 'Incomes',
				},
			},
		]),
	],
	controllers: [IncomeController],
	providers: [IncomeService],
})
export class IncomeModule {}
