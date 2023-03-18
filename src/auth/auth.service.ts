import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { genSalt, hash, compare } from 'bcryptjs';
import { USER_NOT_FOUND } from './auth.exception.constants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	async createUser(dto: AuthDto) {
		const salt = await genSalt(10);
		const passwordHash = await hash(dto.password, salt);
		return await this.userService.createUser({
			email: dto.email,
			passwordHash,
			tgID: dto.tgID,
		});
	}

	async findUser({ email }: AuthDto) {
		return await this.userService.findUser({ email });
	}

	async validateUser(email: string, password: string) {
		const user = await this.findUser({ email, password });
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND);
		}
		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(USER_NOT_FOUND);
		}

		return { email };
	}
}
