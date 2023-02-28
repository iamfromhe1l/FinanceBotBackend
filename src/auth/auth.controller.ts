import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	@Post()
	async register(@Body() dto: AuthDto) {
		console.log(dto);
	}
}
