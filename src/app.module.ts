import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './configs/mongo.config';
import { BalanceModule } from './balance/balance.module';
import { MyDebtsModule } from './myDebts/myDebts.module';
import { IncomeModule } from './income/income.module';
import { UserModule } from './user/user.module';
import { DebtsToMeModule } from './debtsToMe/debtsToMe.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guard';

@Module({
	imports: [
		AuthModule,
		MyDebtsModule,
		DebtsToMeModule,
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		BalanceModule,
		IncomeModule,
		UserModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: AtGuard,
		},
	],
})
export class AppModule {}
