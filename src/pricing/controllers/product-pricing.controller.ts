import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProductPricingService } from '../services/product-pricing.service';
import { CreateProductPricingDto } from '../dto/create-product-pricing.dto';
import { UpdateProductPricingDto } from '../dto/update-product-pricing.dto';

@Controller()
export class ProductPricingController {
  constructor(private readonly service: ProductPricingService) {}

  @MessagePattern('product-pricing.create')
  create(@Payload() dto: CreateProductPricingDto) {
    return this.service.create(dto);
  }

  @MessagePattern('product-pricing.findAll')
  findAll(@Payload() data: { page?: number; limit?: number }) {
    return this.service.findAll(data.page, data.limit);
  }

  @MessagePattern('product-pricing.findByProduct')
  findByProduct(@Payload() data: { productId: number }) {
    return this.service.findByProduct(data.productId);
  }

  @MessagePattern('product-pricing.findOne')
  findOne(@Payload() data: { id: number }) {
    return this.service.findOne(data.id);
  }

  @MessagePattern('product-pricing.update')
  update(@Payload() data: { id: number } & UpdateProductPricingDto) {
    const { id, ...dto } = data;
    return this.service.update(id, dto);
  }

  @MessagePattern('product-pricing.delete')
  async remove(@Payload() data: { id: number }) {
    await this.service.remove(data.id);
    return { message: 'Pricing eliminado' };
  }
}
