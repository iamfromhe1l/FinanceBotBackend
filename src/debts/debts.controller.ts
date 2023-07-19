import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import {DebtsService} from './debts.service';
import {AddDebtsDto} from './dto/add.debts.dto';
import {RemoveDebtsDto} from './dto/remove.debts.dto';
import {EditDebtsDto} from './dto/edit.debts.dto';
import {DebtsModel} from './debts.model';
import {GetCurrentUserEmail} from 'src/common/decorators/get-current-userEmail.decorator';
import {CloseDebtsDto} from './dto/close.debts.dto';
import {debt} from './debts.type';
import {ObjectId, Types} from 'mongoose';
import {availableCurrency} from "../balance/names";
import {EditIdDebtsDto} from "./dto/edit.id.debts.dto";

@Controller('debts')
export class DebtsController {
    constructor(private readonly debtsService: DebtsService) {
    }

    //TODO При измененной базовой валюты, например написать helper который будет менять курсы на нужные
    //TODO и вызывать его в интерсепторе

    @Post('add')
    async addDebt(
        @GetCurrentUserEmail() email: string,
        @Body() dto: AddDebtsDto
    ): Promise<DebtsModel> {
        return this.debtsService.addDebt(email, dto);
    }

    @Post('close')
    async closeDebt(
        @GetCurrentUserEmail() email: string,
        @Body() dto: CloseDebtsDto,
    ): Promise<DebtsModel> {
        return this.debtsService.closeDebt(email, dto);
    }

    @Delete()
    async deleteDebt(
        @GetCurrentUserEmail() email: string,
        @Body() dto: RemoveDebtsDto,
    ): Promise<DebtsModel> {
        return this.debtsService.deleteDebt(email, dto);
    }

    @Delete(':id')
    async deleteDebtById(
        @GetCurrentUserEmail() email: string,
        @Param('id') id: Types.ObjectId,
    ): Promise<DebtsModel> {
        return this.debtsService.deleteDebtById(email, id);
    }

    @Get('debtsList')
    async getDebtsList(
        @GetCurrentUserEmail() email: string,
        @Query('debtType') debtType: debt,
    ): Promise<DebtsModel[]> {
        return this.debtsService.getDebtsList(email, debtType);
    }

    @Get('rangedDebtsList')
    async getRangedDebtsList(
        @GetCurrentUserEmail() email: string,
        @Query('step') step: number,
        @Query('current') current: number,
        @Query('debtType') debtType: debt,
    ): Promise<DebtsModel[]> {
        return this.debtsService.getRangedDebtsList(email, debtType, step, current);
    }

    @Get("reduced")
    async getReducedDebts(
        @GetCurrentUserEmail() email: string,
        @Query('debtType') debtType: debt,
    ): Promise<number> {
        return this.debtsService.getReducedDebts(email, debtType);
    }

    @Get('reducedMap')
    async getReducedDebtsMap(
        @GetCurrentUserEmail() email: string,
        @Query('debtType') debtType: debt,
    ): Promise<Map<availableCurrency, number>> {
        return this.debtsService.getReducedDebtsMap(email, debtType);
    }

    @Put()
    async editDebts(
        @GetCurrentUserEmail() email: string,
        @Body() dto: EditDebtsDto,
    ): Promise<DebtsModel> {
        return this.debtsService.editDebt(email, dto);
    }

    //create DTO
    @Put(':id')
    async editDebtById(
        @GetCurrentUserEmail() email: string,
        @Body() dto: EditIdDebtsDto,
        @Param('id') id: Types.ObjectId,
    ): Promise<DebtsModel> {
        return this.debtsService.editDebtById(email, id, dto);
    }
}
