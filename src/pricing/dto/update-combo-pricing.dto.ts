import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateComboPricingDto } from './create-combo-pricing.dto';

export class UpdateComboPricingDto extends PartialType(
  OmitType(CreateComboPricingDto, ['comboId'] as const),
) {}
