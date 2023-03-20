import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {MyDebtsService} from "./myDebts.service";
import {AddMyDebtsDto} from "./dto/add.myDebts.dto";
import {RemoveMyDebtsDto} from "./dto/remove.myDebts.dto";
import {ValidateDto} from "../globalDto/validate.dto";
import {EditMyDebtsDto} from "./dto/edit.myDebts.dto";
import {MyDebtsModel} from "./myDebts.model";
import {UserModel} from "../user/user.model";

@Controller('myDebts')
export class MyDebtsController {
    constructor(private readonly myDebtsService: MyDebtsService) {}

    @Post('add')
    async addMyDebt(@Body() dto: AddMyDebtsDto): Promise<MyDebtsModel|UserModel> {
        return this.myDebtsService.addMyDebt(dto);
    }

    @Delete()
    async deleteMyDebt(@Body() dto: RemoveMyDebtsDto): Promise<MyDebtsModel|number> {
        return this.myDebtsService.deleteMyDebt(dto);
    }

    @Get('debtsList')
    async getDebtsList(@Body() dto: ValidateDto): Promise<MyDebtsModel[]> {
        return this.myDebtsService.getDebtsList(dto);
    }

    @Get('debtsTotal')
    async getTotalDebts(@Body() dto: ValidateDto): Promise<number> {
        return this.myDebtsService.getTotalDebts(dto);
    }

    @Put()
    async editMyDebt(@Body() dto: EditMyDebtsDto): Promise<MyDebtsModel|number> {
        return this.myDebtsService.editMyDebt(dto);
    }

}