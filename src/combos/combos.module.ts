import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComboEntity } from './entities/combo.entity';
import { ComboItemEntity } from './entities/combo-item.entity';
import { ComboImageEntity } from '../combo-images/entities/combo-image.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
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
    ]),
  ],
  controllers: [ComboController],
  providers: [ComboService],
  exports: [TypeOrmModule],
})
export class CombosModule {}
