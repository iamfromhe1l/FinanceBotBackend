import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/auth/user.model';
import {mongoose, ReturnModelType} from '@typegoose/typegoose';
import {MyDebtsModel} from "./myDebts.model";
import {AddMyDebtsDto} from "./dto/add.myDebts.dto";
import {RemoveMyDebtsDto} from "./dto/remove.myDebts.dto";
import {GetTotalMyDebtsDto} from "./dto/getTotal.myDebts.dto";

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
    async getDebtById(id) {
        return await this.myDebtsModel.findOne({ _id:id }).exec();
    }
    async getDebtsList(dto: GetTotalMyDebtsDto) {
        const user = await this.getUser(dto.email);
        const debtsList = [];
        for (const el of user.myDebts) {
            const debt = await this.getDebtById(el.id);
            debtsList.push(debt);
        }
        return debtsList;
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

    async getTotalDebts(dto: GetTotalMyDebtsDto){
        const debtsList = await this.getDebtsList({email:dto.email});
        return debtsList.map(el => el.amount).reduce((acc,el)=>acc+el);
    }
}
