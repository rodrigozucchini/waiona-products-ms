import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ProductPricingService } from '../services/product-pricing.service';
import { GrpcExceptionFilter } from '../../common/filters/grpc-exception.filter';
import { toPaginated } from '../../common/grpc/paginate.util';
import { CreateProductPricingDto } from '../dto/create-product-pricing.dto';
import { UpdateProductPricingDto } from '../dto/update-product-pricing.dto';
import { ProductPricingResponseDto } from '../dto/product-pricing-response.dto';

function toGrpcProductPricing(dto: ProductPricingResponseDto) {
  return {
    id: dto.id,
    productId: dto.productId,
    currency: dto.currency,
    unitPrice: dto.unitPrice,
    salePrice: dto.salePrice,
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString(),
  };
}

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class ProductPricingController {
  constructor(private readonly service: ProductPricingService) {}

  @GrpcMethod('ProductsService', 'ProductPricingCreate')
  async create(dto: CreateProductPricingDto) {
    return toGrpcProductPricing(await this.service.create(dto));
  }

  @GrpcMethod('ProductsService', 'ProductPricingFindAll')
  async findAll(data: { page?: number; limit?: number }) {
    const page = await this.service.findAll(data.page, data.limit);
    return toPaginated(page, toGrpcProductPricing);
  }

  @GrpcMethod('ProductsService', 'ProductPricingFindByProduct')
  async findByProduct(data: { productId: number }) {
    return toGrpcProductPricing(
      await this.service.findByProduct(data.productId),
    );
  }

  @GrpcMethod('ProductsService', 'ProductPricingFindOne')
  async findOne(data: { id: number }) {
    return toGrpcProductPricing(await this.service.findOne(data.id));
  }

  @GrpcMethod('ProductsService', 'ProductPricingUpdate')
  async update(data: { id: number } & UpdateProductPricingDto) {
    const { id, ...dto } = data;
    return toGrpcProductPricing(await this.service.update(id, dto));
  }

  @GrpcMethod('ProductsService', 'ProductPricingDelete')
  async delete(data: { id: number }) {
    await this.service.remove(data.id);
    return { message: 'Pricing eliminado' };
  }
}
