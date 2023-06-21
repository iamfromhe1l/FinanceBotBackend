import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import {PublicController} from "./public.controller";
import {PublicService} from "./public.service";
import {TypegooseModule} from "nestjs-typegoose";
import {DebtsToMeModel} from "../debtsToMe/debtsToMe.model";
import {UserModel} from "../user/user.model";
import {PublicModel} from "./public.model";

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
        ScheduleModule.forRoot(),
    ],
    controllers: [PublicController],
    providers: [PublicService],
    exports: [],
})
export class PublicModule {}