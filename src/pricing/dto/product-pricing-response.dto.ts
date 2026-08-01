import { ProductPricingEntity } from '../entities/product-pricing.entity';
import { CurrencyCode } from '../../common/enums/currency-code.enum';

export class ProductPricingResponseDto {
  id: number;
  productId: number;
  currency: CurrencyCode;
  unitPrice: number;
  salePrice: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: ProductPricingEntity) {
    this.id = entity.id;
    this.productId = entity.productId;
    this.currency = entity.currency;
    this.unitPrice = Number(entity.unitPrice);
    this.salePrice = Number(entity.salePrice);
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
