import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { DebtsController } from './debts.controller';
import { DebtsService } from './debts.service';
import { DebtsModel } from './debts.model';
import { ScheduleModule } from '@nestjs/schedule';
import { BalanceModule } from "../balance/balance.module";

@Module({
	imports: [
		ConfigModule,
		TypegooseModule.forFeature([
			{
				typegooseClass: DebtsModel,
				schemaOptions: {
					collection: 'Debts',
				},
			},
		]),
		BalanceModule,
		ScheduleModule.forRoot()
	],
	controllers: [DebtsController],
	providers: [DebtsService],
	exports: [DebtsService],
})
export class DebtsModule {}
