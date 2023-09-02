import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from "@nestjs/common";
import { DebtsService } from "./debts.service";
import { AddDebtsDto } from "./dto/add.debts.dto";
import { DebtsModel } from "./debts.model";
import { GetCurrentUserEmail } from "src/common/decorators/get-current-userEmail.decorator";
import { CloseDebtsDto } from "./dto/close.debts.dto";
import { debtHolderType } from "./debts.type";
import { Types } from "mongoose";
import { availableCurrency } from "../balance/balance.types";
import { EditDebtsDto } from "./dto/edit.debts.dto";
import { DiffDebtsDto } from "./dto/diff.debts.dto";

@Controller("debts")
export class DebtsController {
    constructor(private readonly debtsService: DebtsService) {
    }

    @Post("add")
    async addDebt(
        @GetCurrentUserEmail() email: string,
        @Body() dto: AddDebtsDto,
    ): Promise<DebtsModel> {
        return this.debtsService.addDebt(email, dto);
    }

    @Post("close")
    async closeDebt(
        @GetCurrentUserEmail() email: string,
        @Body() dto: CloseDebtsDto,
    ): Promise<DebtsModel> {
        return this.debtsService.closeDebt(email, dto);
    }

    @Delete(":id")
    async deleteDebt(
        @GetCurrentUserEmail() email: string,
        @Param("id") id: Types.ObjectId,
    ): Promise<DebtsModel> {
        return this.debtsService.deleteDebt(email, id);
    }

    @Get("debtsList")
    async getDebtsList(
        @GetCurrentUserEmail() email: string,
        @Query("debtType") debtType: debtHolderType,
    ): Promise<DebtsModel[]> {
        return this.debtsService.getDebtsList(email, debtType);
    }

    @Get("rangedDebtsList")
    async getRangedDebtsList(
        @GetCurrentUserEmail() email: string,
        @Query("step") step: number,
        @Query("current") current: number,
        @Query("debtType") debtType: debtHolderType,
    ): Promise<DebtsModel[]> {
        return this.debtsService.getRangedDebtsList(email, debtType, step, current);
    }

    @Put("edit")
    async editDebt(
        @GetCurrentUserEmail() email: string,
        @Body() dto: EditDebtsDto,
    ): Promise<DebtsModel> {
        return this.debtsService.editDebt(email, dto);
    }

    @Put()
    async diffDebt(
        @GetCurrentUserEmail() email: string,
        @Body() dto: DiffDebtsDto,
    ): Promise<DebtsModel> {
        return this.debtsService.diffDebt(email, dto);
    }

    @Get("reduced")
    async getReducedDebts(
        @GetCurrentUserEmail() email: string,
        @Query("debtType") debtType: debtHolderType,
    ): Promise<number> {
        return this.debtsService.getReducedDebts(email, debtType);
    }

    @Get("reducedMap")
    async getReducedDebtsMap(
        @GetCurrentUserEmail() email: string,
        @Query("debtType") debtType: debtHolderType,
    ): Promise<Map<availableCurrency, number>> {
        return this.debtsService.getReducedDebtsMap(email, debtType);
    }


}
