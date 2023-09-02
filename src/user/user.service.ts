import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/user.create.dto';
import { Types } from "mongoose";

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel)
		private readonly userModel: ReturnModelType<typeof UserModel>,
	) {}

	async findUser(email: string) {
		return await this.userModel.findOne({ email }).populate("listBalance").exec();
	}

	async pushToNestedArray(email: string, id: Types.ObjectId, name: string): Promise<void>{
		this.userModel.updateOne(
			{ email: email },
			{ $push: { [name]: id } }
		);
	}

	async popFromNestedArray(email: string, id: Types.ObjectId, name: string): Promise<void>{
		this.userModel.updateOne(
			{email: email },
			{ $pull: { [name]: { $in: id } } }
		);
	}

	async getUserWithPopulate(email: string) {
		return (await this.userModel.findOne({ email })).populate([
			{ path: 'payments' },
			{ path: 'debts' },
		]);
	}

	async getUserWithDebtsPopulate(email: string) {
		return (await this.userModel.findOne({ email })).populate([
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
