import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { CreateCartedProdutsDto } from './create-user-carted.dto';

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

  @IsArray()
  @IsNotEmpty()
  ordered: CreateCartedProdutsDto[];
}
