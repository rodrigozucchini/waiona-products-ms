import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { ComboItemEntity } from '../combos/entities/combo-item.entity';
import { ProductImageEntity } from '../product-images/entities/product-image.entity';
import { ProductPricingEntity } from '../pricing/entities/product-pricing.entity';
import { ProductTaxEntity } from '../taxation/product-taxes/entities/product-taxes.entity';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      CategoryEntity,
      ComboItemEntity,
      ProductImageEntity,
      ProductPricingEntity,
      ProductTaxEntity,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
