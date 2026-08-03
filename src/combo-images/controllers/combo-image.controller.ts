import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ComboImageService } from '../services/combo-image.service';
import { GrpcExceptionFilter } from '../../common/filters/grpc-exception.filter';
import { CreateComboImageDto } from '../dto/create-combo-image.dto';
import { UpdateComboImageDto } from '../dto/update-combo-image.dto';
import { UploadComboImageDto } from '../dto/upload-combo-image.dto';
import { ComboImageResponseDto } from '../dto/combo-image-response.dto';

function toGrpcComboImage(dto: ComboImageResponseDto) {
  return {
    id: dto.id,
    comboId: dto.comboId,
    url: dto.url,
    position: dto.position,
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString(),
  };
}

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class ComboImageController {
  constructor(private readonly comboImageService: ComboImageService) {}

  @GrpcMethod('ProductsService', 'ComboImagesCreate')
  async create(dto: CreateComboImageDto) {
    return toGrpcComboImage(await this.comboImageService.create(dto));
  }

  @GrpcMethod('ProductsService', 'ComboImagesUpload')
  async upload(data: { buffer: Buffer } & UploadComboImageDto) {
    const { buffer, ...dto } = data;
    return toGrpcComboImage(
      await this.comboImageService.uploadImage(buffer, dto),
    );
  }

  @GrpcMethod('ProductsService', 'ComboImagesFindByCombo')
  async findByCombo(data: { comboId: number }) {
    const images = await this.comboImageService.findByCombo(data.comboId);
    return { data: images.map(toGrpcComboImage) };
  }

  @GrpcMethod('ProductsService', 'ComboImagesFindOne')
  async findOne(data: { id: number }) {
    return toGrpcComboImage(await this.comboImageService.findOne(data.id));
  }

  @GrpcMethod('ProductsService', 'ComboImagesUpdate')
  async update(data: { id: number } & UpdateComboImageDto) {
    const { id, ...dto } = data;
    return toGrpcComboImage(await this.comboImageService.update(id, dto));
  }

  @GrpcMethod('ProductsService', 'ComboImagesDelete')
  async delete(data: { id: number }) {
    await this.comboImageService.remove(data.id);
    return { message: 'Imagen eliminada' };
  }
}
