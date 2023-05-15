import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { genSalt, hash, compare } from 'bcryptjs';
import { USER_NOT_FOUND } from './auth.exception.constants';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types/tokens.type';
import { ValidateDto } from 'src/globalDto/validate.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async getTokens(email: string) {
		const [at, rt] = await Promise.all([
			this.jwtService.signAsync(
				{
					email,
				},
				{
					expiresIn: 15 * 60,
					secret: this.configService.get('JWT_SECRET_AT'),
				},
			),
			this.jwtService.signAsync(
				{
					email,
				},
				{
					expiresIn: 60 * 60 * 24 * 7,
					secret: this.configService.get('JWT_SECRET_RT'),
				},
			),
		]);
		return {
			access_token: at,
			refresh_token: rt,
		};
	}

	async updateRtHash(email: string) {
		const salt = await genSalt(10);
		const hash_data = await hash(email, salt);
		await this.userService.updateUserHashRT(email, hash_data);
	}

	async createUser(dto: AuthDto): Promise<Tokens> {
		const salt = await genSalt(10);
		const passwordHash = await hash(dto.password, salt);
		await this.userService.createUser({
			email: dto.email,
			name: dto.name,
			passwordHash,
		});
		const tokens = await this.getTokens(dto.email);
		await this.updateRtHash(dto.email);
		return tokens;
	}

	async findUser({ email }: ValidateDto) {
		return await this.userService.findUser({ email });
	}

	async validateUser(email: string, password: string): Promise<Tokens> {
		const user = await this.findUser({ email });
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND);
		}
		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(USER_NOT_FOUND);
		}
		const tokens = await this.getTokens(email);
		await this.updateRtHash(email);
		return tokens;
	}
	//async refresh(dto: AuthDto) {}
}
