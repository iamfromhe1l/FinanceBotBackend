import {Body, Controller, Delete, Get, Post} from '@nestjs/common';
import {MyDebtsService} from "./myDebts.service";
import {AddMyDebtsDto} from "./dto/add.myDebts.dto";
import {RemoveMyDebtsDto} from "./dto/remove.myDebts.dto";
import {GetTotalMyDebtsDto} from "./dto/getTotal.myDebts.dto";

@Controller('myDebts')
export class MyDebtsController {
    constructor(private readonly myDebtsService: MyDebtsService) {}

    @Post('add')
    async addMyDebt(@Body() dto: AddMyDebtsDto) {
        return this.myDebtsService.addMyDebt(dto);
    }

    @Delete()
    async deleteMyDebt(@Body() dto: RemoveMyDebtsDto) {
        return this.myDebtsService.deleteMyDebt(dto);
    }

    @Get('debtsList')
    async getDebtsList(@Body() dto: GetTotalMyDebtsDto) {
        return this.myDebtsService.getDebtsList(dto);
    }

    @Get('debtsTotal')
    async getTotalDebts(@Body() dto: GetTotalMyDebtsDto) {
        return this.myDebtsService.getTotalDebts(dto);
    }

}