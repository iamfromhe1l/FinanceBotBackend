import {Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import {BalanceService} from './balance.service';
import {EditBalanceDto} from './dto/edit.balance.dto';
import {DiffBalanceDto} from './dto/diff.balance.dto';
import {GetCurrentUserEmail} from 'src/common/decorators/get-current-userEmail.decorator';
import {Public} from "../common/decorators/public.decorator";
import {Edit2BalanceDto} from "./dto/edit2.balance.dto";
import {Diff2BalanceDto} from "./dto/diff2.balance.dto";

@Controller('balance')
export class BalanceController {
    constructor(private readonly balanceService: BalanceService) {
    }

    // @Post('edit')
    // async editBalance(
    // 	@GetCurrentUserEmail() email: string,
    // 	@Body() dto: EditBalanceDto,
    // ): Promise<{ balance: number }> {
    // 	return await this.balanceService.editBalance(email, dto);
    // }
    //
    //
    //
    // @Post('diff')
    // async diffBalance(
    // 	@GetCurrentUserEmail() email: string,
    // 	@Body() dto: DiffBalanceDto,
    // ): Promise<{ balance: number }> {
    // 	return await this.balanceService.diffBalace(email, dto);
    // }
    //
    // @Get()
    // async getBalance(@GetCurrentUserEmail() email: string): Promise<number> {
    // 	return await this.balanceService.getBalance(email);
    // }



    // --------------------------- New version -----------------------------------

    @Get()
    async getBalance2(@GetCurrentUserEmail() email: string): Promise<Map<string,number>> {
    	return await this.balanceService.getBalance2(email);
    }

    @Post('add/:name')
    async addCurrency(@GetCurrentUserEmail() email: string, @Param('name') name: string): Promise<boolean> {
        return await this.balanceService.addCurrency(email,name);
    }

    @Public()
    @Get('names')
    getNames(): string{
        return this.balanceService.getNames();
    }

    @Public()
    @Get('currencies')
    async getCurrencies(@Query('newBase') newBase?: string): Promise<string>{
        return await this.balanceService.getCurrencies(newBase);
    }

    @Put()
    async editBalance2(
    	@GetCurrentUserEmail() email: string,
    	@Body() dto: Edit2BalanceDto,
    ): Promise<number | Map<string,number>>{
    	return await this.balanceService.editBalance2(email, dto);
    }

    @Put('diff')
    async diffBalance2(
    	@GetCurrentUserEmail() email: string,
    	@Body() dto: Diff2BalanceDto,
    ): Promise<number | Map<string,number>> {
    	return await this.balanceService.diffBalance2(email, dto);
    }



    // Не нужно
    @Public()
    @Get("TEST")
    async test(){
        return await this.balanceService.updateCurrenciesData();
    }
}
