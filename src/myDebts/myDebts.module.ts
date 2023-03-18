import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import {MyDebtsController} from "./myDebts.controller";
import {MyDebtsService} from "./myDebts.service";
import {MyDebtsModel} from "./myDebts.model";
import {UserModule} from "../user/user.module";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [
        ConfigModule,
        TypegooseModule.forFeature([
            {
                typegooseClass: MyDebtsModel,
                schemaOptions: {
                    collection: 'MyDebts',
                },
            },
        ]),
        UserModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [MyDebtsController],
    providers: [MyDebtsService],
    exports: [MyDebtsService],
})
export class MyDebtsModule {}