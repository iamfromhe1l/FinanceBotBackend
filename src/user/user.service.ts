import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/user.create.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel)
		private readonly userModel: ReturnModelType<typeof UserModel>,
	) {}

	async findUser(email: string) {
		return await this.userModel.findOne({ email }).populate("listBalance").exec();
	}

	async getUserWithPopulate(email: string) {
		return (await this.userModel.findOne({ email })).populate([
			{ path: 'payments' },
			{ path: 'debts' },
		]);
	}

	async createUser(email: string, dto: CreateUserDto) {
		const newUser = new this.userModel({
			email,
			name: dto.name || 'User',
			passwordHash: dto.passwordHash,
		});
		return await newUser.save();
	}

	async updateUserHashRT(email: string, hash: string) {
		await this.userModel.findOneAndUpdate({ email }, { hashRt: hash });
	}
}
