import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/auth/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
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
        const debt = await this.getDebt(dto.name)
        if (debt) {
            debt.amount += dto.amount;
            return debt.save()
        }
        const newDebt = new this.myDebtsModel({
            email: dto.email,
            name: dto.name,
            amount: dto.amount,
        });
        await newDebt.save();
        const user = await this.getUser(dto.email);
        user.myDebts = [...user.myDebts, {id:newDebt._id}]
        return user.save();
    }

    async editMyDebt(){

    }

    async deleteMyDebt(dto: RemoveMyDebtsDto) {
        const debt = await this.getDebt(dto.name);

        // refactor using throw exception
        if (!debt) return -1;
        const id = debt._id;
        const user = await this.getUser(dto.email);
        user.myDebts.splice(user.myDebts.indexOf({"id":id}));
        await user.save();
        return debt.remove();
    }

    async getDebtsList() {

    }

    async getTotalDebt() {

    }
}
