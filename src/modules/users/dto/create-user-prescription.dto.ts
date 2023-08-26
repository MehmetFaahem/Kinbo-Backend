import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserPrescriptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsNotEmpty()
  image: Express.Multer.File;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  delivered: boolean;

  @ApiProperty()
  @IsString()
  order_date: string;
}
