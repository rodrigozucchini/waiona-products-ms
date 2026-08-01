import { PartialType } from '@nestjs/mapped-types';
import { CreateProductTaxDto } from './create-product-tax.dto';

export class UpdateProductTaxDto extends PartialType(CreateProductTaxDto) {}
