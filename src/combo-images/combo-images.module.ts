import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComboImageEntity } from './entities/combo-image.entity';
import { ComboEntity } from '../combos/entities/combo.entity';
import { ComboImageService } from './services/combo-image.service';
import { ComboImageController } from './controllers/combo-image.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ComboImageEntity, ComboEntity])],
  controllers: [ComboImageController],
  providers: [ComboImageService],
  exports: [TypeOrmModule],
})
export class ComboImagesModule {}
