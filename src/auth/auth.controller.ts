import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED } from './auth.exception.constants';
import { Tokens } from './types/tokens.type';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: AuthDto): Promise<Tokens> {
		const oldUser = await this.authService.findUser(dto);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED);
		}
		return await this.authService.createUser(dto);
	}

	@Post('login')
	async login(@Body() dto: AuthDto): Promise<Tokens> {
		return await this.authService.validateUser(dto.email, dto.password);
	}

	//@Post('refresh')
	//async refresh(dto: AuthDto) {}

	//@Post('logout')
	//async logout(dto: AuthDto) {}
}
