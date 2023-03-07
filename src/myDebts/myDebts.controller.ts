import {Body, Controller, Delete, Get, Post} from '@nestjs/common';
import {MyDebtsService} from "./myDebts.service";
import {AddMyDebtsDto} from "./dto/add.myDebts.dto";
import {RemoveMyDebtsDto} from "./dto/remove.myDebts.dto";

@Controller('myDebts')
export class MyDebtsController {
    constructor(private readonly myDebtsService: MyDebtsService) {}

    @Post('add')
    async addMyDebt(@Body() dto: AddMyDebtsDto) {
        return this.myDebtsService.addMyDebt(dto);
    }

    @Post()
    async deleteMyDebt(@Body() dto: RemoveMyDebtsDto) {
        return this.myDebtsService.deleteMyDebt(dto);
    }

    // @Get('getBalance')
    // async getBalance(@Body() dto: EmailDto) {
    //     return this.balanceService.getBalance(dto);
    // }
}