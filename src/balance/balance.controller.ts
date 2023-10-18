import {Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import {BalanceService} from './balance.service';
import {GetCurrentUserEmail} from 'src/common/decorators/get-current-userEmail.decorator';
import {Public} from "../common/decorators/public.decorator";
import {EditBalanceDto} from "./dto/edit.balance.dto";
import {DiffBalanceDto} from "./dto/diff.balance.dto";
import {namesType} from "./balance.types";

@Controller('balance')
export class BalanceController {
    constructor(private readonly balanceService: BalanceService) {
    }


    @Get()
    async getBalance(@GetCurrentUserEmail() email: string): Promise<Map<string,number>> {
    	return await this.balanceService.getBalance(email);
    }

    @Post('add/:name')
    async addCurrency(@GetCurrentUserEmail() email: string, @Param('name') name: string): Promise<boolean> {
        return await this.balanceService.addCurrency(email,name);
    }

    @Public()
    @Get('names')
    getNames(): namesType{
        return this.balanceService.getNames();
    }

    @Public()
    @Get('currencies')
    async getCurrencies(@Query('newBase') newBase?: string): Promise<Map<string,number>>{
        return await this.balanceService.getCurrencies(newBase);
    }

    @Put()
    async editBalance(
    	@GetCurrentUserEmail() email: string,
    	@Body() dto: EditBalanceDto,
    ): Promise<Map<string,number>>{
    	return await this.balanceService.editBalance(email, dto);
    }

    @Put('diff')
    async diffBalance(
    	@GetCurrentUserEmail() email: string,
    	@Body() dto: DiffBalanceDto,
    ): Promise<Map<string,number>> {
    	return await this.balanceService.diffBalance(email, dto);
    }

    @Get('_update')
    async updateCurrenciesData(): Promise<void> {
    	await this.balanceService.updateCurrenciesData();
    }

}
