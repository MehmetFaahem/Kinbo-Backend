import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateCartedProdutsDto } from './create-user-carted.dto';
import { Type } from 'class-transformer';

export class CreateOrdersDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  delivery_method: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  order_date: string;

  @ValidateNested({ each: true })
  @Type(() => CreateCartedProdutsDto)
  ordered: CreateCartedProdutsDto[];
}
