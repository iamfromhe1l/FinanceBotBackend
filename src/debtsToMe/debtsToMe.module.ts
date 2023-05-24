import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { DebtsToMeController } from './debtsToMe.controller';
import { DebtsToMeService } from './debtsToMe.service';
import { DebtsToMeModel } from './debtsToMe.model';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [
		ConfigModule,
		TypegooseModule.forFeature([
			{
				typegooseClass: DebtsToMeModel,
				schemaOptions: {
					collection: 'DebtsToMe',
				},
			},
		]),
		ScheduleModule.forRoot(),
	],
	controllers: [DebtsToMeController],
	providers: [DebtsToMeService],
	exports: [DebtsToMeService],
})
export class DebtsToMeModule {}
