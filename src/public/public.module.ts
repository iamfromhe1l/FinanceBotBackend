import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import {PublicController} from "./public.controller";
import {PublicService} from "./public.service";
import {TypegooseModule} from "nestjs-typegoose";
import {UserModel} from "../user/user.model";
import {PublicModel} from "./public.model";
import { BalanceModule } from "../balance/balance.module";
import { PaymentModule } from "../payment/payment.module";

@Module({
    imports: [
        ConfigModule,
        TypegooseModule.forFeature([
            {
                typegooseClass: UserModel,
                schemaOptions: {
                    collection: 'Users',
                },
            },
            {
                typegooseClass: PublicModel,
                schemaOptions: {
                    collection: 'Public',
                },
            },
        ]),
        BalanceModule,
        PaymentModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [PublicController],
    providers: [PublicService],
    exports: [],
})
export class PublicModule {}