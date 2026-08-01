import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProductImageService } from '../services/product-image.service';
import { CreateProductImageDto } from '../dto/create-product-image.dto';
import { UpdateProductImageDto } from '../dto/update-product-image.dto';
import { UploadProductImageDto } from '../dto/upload-product-image.dto';

@Controller()
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @MessagePattern('product-images.create')
  create(@Payload() dto: CreateProductImageDto) {
    return this.productImageService.create(dto);
  }

  @MessagePattern('product-images.upload')
  upload(@Payload() data: { buffer: string } & UploadProductImageDto) {
    const { buffer, ...dto } = data;
    return this.productImageService.uploadImage(
      Buffer.from(buffer, 'base64'),
      dto,
    );
  }

  @MessagePattern('product-images.findByProduct')
  findByProduct(@Payload() data: { productId: number }) {
    return this.productImageService.findByProduct(data.productId);
  }

  @MessagePattern('product-images.findOne')
  findOne(@Payload() data: { id: number }) {
    return this.productImageService.findOne(data.id);
  }

  @MessagePattern('product-images.update')
  update(@Payload() data: { id: number } & UpdateProductImageDto) {
    const { id, ...dto } = data;
    return this.productImageService.update(id, dto);
  }

  @MessagePattern('product-images.delete')
  async remove(@Payload() data: { id: number }) {
    await this.productImageService.remove(data.id);
    return { message: 'Imagen eliminada' };
  }
}
