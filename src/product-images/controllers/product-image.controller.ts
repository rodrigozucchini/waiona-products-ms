import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ProductImageService } from '../services/product-image.service';
import { GrpcExceptionFilter } from '../../common/filters/grpc-exception.filter';
import { CreateProductImageDto } from '../dto/create-product-image.dto';
import { UpdateProductImageDto } from '../dto/update-product-image.dto';
import { UploadProductImageDto } from '../dto/upload-product-image.dto';
import { ProductImageResponseDto } from '../dto/product-image-response.dto';

function toGrpcProductImage(dto: ProductImageResponseDto) {
  return {
    id: dto.id,
    productId: dto.productId,
    url: dto.url,
    position: dto.position,
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString(),
  };
}

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @GrpcMethod('ProductsService', 'ProductImagesCreate')
  async create(dto: CreateProductImageDto) {
    return toGrpcProductImage(await this.productImageService.create(dto));
  }

  @GrpcMethod('ProductsService', 'ProductImagesUpload')
  async upload(data: { buffer: Buffer } & UploadProductImageDto) {
    const { buffer, ...dto } = data;
    return toGrpcProductImage(
      await this.productImageService.uploadImage(buffer, dto),
    );
  }

  @GrpcMethod('ProductsService', 'ProductImagesFindByProduct')
  async findByProduct(data: { productId: number }) {
    const images = await this.productImageService.findByProduct(
      data.productId,
    );
    return { data: images.map(toGrpcProductImage) };
  }

  @GrpcMethod('ProductsService', 'ProductImagesFindOne')
  async findOne(data: { id: number }) {
    return toGrpcProductImage(await this.productImageService.findOne(data.id));
  }

  @GrpcMethod('ProductsService', 'ProductImagesUpdate')
  async update(data: { id: number } & UpdateProductImageDto) {
    const { id, ...dto } = data;
    return toGrpcProductImage(
      await this.productImageService.update(id, dto),
    );
  }

  @GrpcMethod('ProductsService', 'ProductImagesDelete')
  async delete(data: { id: number }) {
    await this.productImageService.remove(data.id);
    return { message: 'Imagen eliminada' };
  }
}
