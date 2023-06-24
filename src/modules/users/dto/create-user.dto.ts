import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  address: string;

  @IsString()
  dateofbirth: string;

  @IsString()
  gender: string;

  @IsNumber()
  discount: number;
}
