import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductImageEntity } from './entities/product-image.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductImageService } from './services/product-image.service';
import { ProductImageController } from './controllers/product-image.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImageEntity, ProductEntity]),
  ],
  controllers: [ProductImageController],
  providers: [ProductImageService],
  exports: [TypeOrmModule],
})
export class ProductImagesModule {}
