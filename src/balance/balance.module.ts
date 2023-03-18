import { Module } from '@nestjs/common';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [UserModule],
	controllers: [BalanceController],
	providers: [BalanceService],
})
export class BalanceModule {}
