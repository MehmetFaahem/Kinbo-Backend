import { PartialType } from '@nestjs/swagger';
import { CreateOrdersDto } from './create-user-orders.dto';

export class UpdateOrderDto extends PartialType(CreateOrdersDto) {}
