import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from 'src/auth/user.model';

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
		]),
	],
	controllers: [BalanceController],
	providers: [BalanceService],
})
export class BalanceModule {}
