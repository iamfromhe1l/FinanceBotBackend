import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/auth/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { EmailDto } from 'src/globalDto/email.dto';
import {MyDebtsModel} from "./myDebts.model";
import {AddMyDebtsDto} from "./dto/add.myDebts.dto";
import {RemoveMyDebtsDto} from "./dto/remove.myDebts.dto";

@Injectable()
export class MyDebtsService {
    constructor(
        @InjectModel(UserModel)
        private readonly userModel: ReturnModelType<typeof UserModel>,
        @InjectModel(MyDebtsModel)
        private readonly myDebtsModel: ReturnModelType<typeof MyDebtsModel>,
    ) {}

    async getUser(email) {
        return await this.userModel.findOne({ email }).exec();
    }
    async getDebt(name) {
        return await this.myDebtsModel.findOne({ name }).exec();
    }

    async addMyDebt(dto: AddMyDebtsDto) {
        const newDebt = new this.myDebtsModel({
            email: dto.email,
            name: dto.name,
            amount: dto.amount,
        });
        return newDebt.save();
    }

    async deleteMyDebt(dto: RemoveMyDebtsDto) {
        const tempName = dto.name;
        const tempDebt = await this.getDebt(tempName);
        if (tempDebt){
            return tempDebt.remove();
        }
        else{
            return 5;
        }
    }

    // async getBalance({ email }: EmailDto) {
    //     return (await this.getUser(email)).balance;
    // }
}
