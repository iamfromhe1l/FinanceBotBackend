import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import {ReturnModelType} from '@typegoose/typegoose';
import {MyDebtsModel} from "./myDebts.model";
import {AddMyDebtsDto} from "./dto/add.myDebts.dto";
import {RemoveMyDebtsDto} from "./dto/remove.myDebts.dto";
import {GetTotalMyDebtsDto} from "./dto/getTotal.myDebts.dto";
import {UserService} from "../user/user.service";

@Injectable()
export class MyDebtsService {
    constructor(
        @InjectModel(MyDebtsModel)
        private readonly myDebtsModel: ReturnModelType<typeof MyDebtsModel>,
        private readonly userService: UserService,
    ) {}

    async getDebt(email,name) {
        return await this.myDebtsModel.findOne({ name:name, email:email }).exec();
    }

    async addMyDebt(dto: AddMyDebtsDto) {
        const debt = await this.getDebt(dto.email, dto.name)
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
        const user = await this.userService.findUser({ email: dto.email });
        user.myDebts = [...user.myDebts, newDebt.id]
        return user.save();
    }

    async deleteMyDebt(dto: RemoveMyDebtsDto) {
        const debt = await this.getDebt(dto.email, dto.name);
        if (!debt) return -1;
        const user = await this.userService.findUser({ email: dto.email });
        user.myDebts.splice(user.myDebts.indexOf(debt.id));
        await user.save();
        return debt.remove();
    }

    async getDebtsList(dto: GetTotalMyDebtsDto) {
        const user = await this.userService.getUserWithPopulate({ email: dto.email })
        return user['myDebts']
    }

    async getTotalDebts(dto: GetTotalMyDebtsDto){
        const debtsList = await this.getDebtsList(dto)
        return debtsList.map(el => el.amount).reduce((acc,el)=>acc+el);
    }
}
