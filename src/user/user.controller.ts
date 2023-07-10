import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GetCurrentUserEmail } from 'src/common/decorators/get-current-userEmail.decorator';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async getUser(@GetCurrentUserEmail() email: string) {
		return await this.userService.getUserWithPopulate(email);
	}
}
