import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { ValidateDto } from 'src/globalDto/validate.dto';
import { CreateUserDto } from './dto/user.create.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel)
		private readonly userModel: ReturnModelType<typeof UserModel>,
	) {}

	async findUser({ email }: ValidateDto) {
		return await this.userModel.findOne({ email }).exec();
	}

	async getUserWithPopulate({ email }: ValidateDto) {
		return (await this.findUser({ email })).populate('incomes');
	}

	async createUser(dto: CreateUserDto) {
		const newUser = new this.userModel({
			email: dto.email,
			passwordHash: dto.passwordHash,
			tgID: dto.tgID ? [dto.tgID] : [],
		});

		return newUser.save();
	}
}
