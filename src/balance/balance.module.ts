import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import {ConfigModule} from "@nestjs/config";
import {TypegooseModule} from "nestjs-typegoose";
import {UserModel} from "../user/user.model";
import {ScheduleModule} from "@nestjs/schedule";
import { BalanceModel } from "./balance.model";

@Module({
	imports: [
		ConfigModule,
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'Users',
				},
			},
			{
				typegooseClass: BalanceModel,
				schemaOptions: {
					collection: 'Currencies',
				},
			},
		]),
		ScheduleModule.forRoot(),
	],
	controllers: [BalanceController],
	providers: [BalanceService],
	exports: [BalanceService],
})
export class BalanceModule {}
