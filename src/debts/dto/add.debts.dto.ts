import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength, ValidateNested,
} from "class-validator";
import { DebtHolderEnum, debtHolderType } from "../debts.type";
import { Type } from "class-transformer";
import { ValueDto } from "../../balance/dto/currency.balance.dto";


export class AddDebtsDto {
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(12)
	@IsString()
	name: string;

	@ValidateNested()
	@Type(() => ValueDto)
	value: ValueDto;

	@IsNotEmpty()
	@IsEnum(DebtHolderEnum)
	type: debtHolderType;

	@IsNotEmpty()
	@IsBoolean()
	editBalance: boolean;

	@IsNotEmpty()
	@IsBoolean()
	isFixed: boolean;
}
