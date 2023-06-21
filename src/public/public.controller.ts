import {Controller, Get} from '@nestjs/common';
import {PublicService} from "./public.service";
import {Public} from "../common/decorators/public.decorator";
import {PublicModel} from "./public.model";
import publicData from "./data.type";

@Controller('public')
export class PublicController {
    constructor(private readonly publicService: PublicService) {
    }

    @Public()
    @Get()
    async getDebtsList(): Promise<publicData> {
        return this.publicService.getPublicData();
    }

}