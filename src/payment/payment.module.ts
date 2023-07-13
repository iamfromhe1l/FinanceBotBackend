import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { PaymentModel } from './payment.model';
import { BalanceModule } from 'src/balance/balance.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [
		ConfigModule,
		TypegooseModule.forFeature([
			{
				typegooseClass: PaymentModel,
				schemaOptions: {
					collection: 'Payments',
				},
			},
		]),
		BalanceModule,
		ScheduleModule.forRoot(),
	],
	controllers: [PaymentController],
	providers: [PaymentService],
})
export class PaymentModule {}
