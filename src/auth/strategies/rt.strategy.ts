import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('JWT_SECRET_RT'),
			passReqToCallback: true,
		});
	}

	validate(req: Request, payload: any) {
		const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
		return {
			...payload,
			refreshToken,
		};
	}
}
