import { Body, Controller, Get } from '@nestjs/common';
import { ValidateDto } from 'src/globalDto/validate.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('getUser')
	async getUser(@Body() dto: ValidateDto) {
		return await this.userService.getUserWithPopulate(dto);
	}
}
