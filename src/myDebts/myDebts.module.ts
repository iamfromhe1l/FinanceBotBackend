import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import {MyDebtsController} from "./myDebts.controller";
import {MyDebtsService} from "./myDebts.service";
import {UserModel} from "../auth/user.model";
import {MyDebtsModel} from "./myDebts.model";

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
                typegooseClass: MyDebtsModel,
                schemaOptions: {
                    collection: 'MyDebts',
                },
            },
        ]),
    ],
    controllers: [MyDebtsController],
    providers: [MyDebtsService],
})
export class MyDebtsModule {}