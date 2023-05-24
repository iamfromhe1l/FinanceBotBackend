import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_REGISTERED } from './auth.exception.constants';
import { Tokens } from './types/tokens.type';
import { RtGuard } from 'src/common/guards/rt.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserEmail } from 'src/common/decorators/get-current-userEmail.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() dto: AuthDto): Promise<Tokens> {
		const oldUser = await this.authService.findUser(dto);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED);
		}
		return await this.authService.createUser(dto);
	}

	@Public()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: AuthDto): Promise<Tokens> {
		return await this.authService.validateUser(dto.email, dto.password);
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@GetCurrentUserEmail() email: string) {
		await this.authService.logoutUser(email);
	}

	@Public()
	@UseGuards(RtGuard)
	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	async refresh(
		@GetCurrentUserEmail() email: string,
		@GetCurrentUser('refreshToken') refreshToken: string,
	): Promise<Tokens> {
		return await this.authService.refreshTokens(email, refreshToken);
	}
}
