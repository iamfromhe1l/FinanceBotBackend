import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';

@Module({
	imports: [UserModule, JwtModule, ConfigModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
