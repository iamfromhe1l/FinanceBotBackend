import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {BalanceService} from './balance.service';
import {EditBalanceDto} from './dto/edit.balance.dto';
import {DiffBalanceDto} from './dto/diff.balance.dto';
import {GetCurrentUserEmail} from 'src/common/decorators/get-current-userEmail.decorator';
import {Public} from "../common/decorators/public.decorator";

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
    async getCurrencies(): Promise<string>{
        return await this.balanceService.getCurrencies();
    }

}
