import { PartialType } from '@nestjs/swagger';
import { CreateUserPrescriptionDto } from './create-user-prescription.dto';

export class UpdatePresOrderDto extends PartialType(
  CreateUserPrescriptionDto,
) {}
