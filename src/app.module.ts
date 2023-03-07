import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './configs/mongo.config';
import { BalanceModule } from './balance/balance.module';
import {MyDebtsModule} from "./myDebts/myDebts.module";

@Module({
	imports: [
		AuthModule,
		MyDebtsModule,
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		BalanceModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}


