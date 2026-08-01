import { ProductTaxEntity } from '../entities/product-taxes.entity';
import { TaxResponseDto } from '../../taxes/dto/tax-response.dto';

export class ProductTaxResponseDto {
  id: number;
  productId: number;
  taxId: number;
  tax?: TaxResponseDto;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: ProductTaxEntity) {
    this.id = entity.id;
    this.productId = entity.productId;
    this.taxId = entity.taxId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;

    if (entity.tax) {
      this.tax = new TaxResponseDto(entity.tax);
    }
  }
}
