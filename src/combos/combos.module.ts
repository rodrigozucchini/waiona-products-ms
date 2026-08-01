import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComboEntity } from './entities/combo.entity';
import { ComboItemEntity } from './entities/combo-item.entity';
import { ComboImageEntity } from '../combo-images/entities/combo-image.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { ComboPricingEntity } from '../pricing/entities/combo-pricing.entity';
import { ProductPricingEntity } from '../pricing/entities/product-pricing.entity';
import { ComboService } from './services/combo.service';
import { ComboController } from './controllers/combo.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ComboEntity,
      ComboItemEntity,
      ComboImageEntity,
      ProductEntity,
      CategoryEntity,
      ComboPricingEntity,
      ProductPricingEntity,
    ]),
  ],
  controllers: [ComboController],
  providers: [ComboService],
  exports: [TypeOrmModule],
})
export class CombosModule {}
