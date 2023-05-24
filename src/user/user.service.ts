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
		return await (await this.findUser({ email }))
			.populate('incomes')
			.populate('expenses')
			.populate('myDebts')
			.populate('debtsToMe')
			.execPopulate();
	}

	async createUser(dto: CreateUserDto) {
		const newUser = await new this.userModel({
			email: dto.email,
			name: dto.name || 'User',
			passwordHash: dto.passwordHash,
		});
		return await newUser.save();
	}

	async updateUserHashRT(email: string, hash: string) {
		await this.userModel.findOneAndUpdate({ email }, { hashRt: hash });
	}
}
