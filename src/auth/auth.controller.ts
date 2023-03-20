import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED } from './auth.exception.constants';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@Post('register')
	async register(@Body() dto: AuthDto): Promise<{ email: string }> {
		const oldUser = await this.authService.findUser(dto);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED);
		}
		const res = await this.authService.createUser(dto);
		return { email: res['email'] };
	}

	@Post('login')
	async login(@Body() dto: AuthDto): Promise<{ email: string }> {
		return await this.authService.validateUser(dto.email, dto.password);
	}
}
