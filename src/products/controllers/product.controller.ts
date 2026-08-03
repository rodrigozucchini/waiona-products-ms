import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ProductService } from '../services/product.service';
import { GrpcExceptionFilter } from '../../common/filters/grpc-exception.filter';
import { toPaginated } from '../../common/grpc/paginate.util';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';

function toGrpcProduct(dto: ProductResponseDto) {
  return {
    id: dto.id,
    sku: dto.sku,
    name: dto.name,
    description: dto.description,
    isActive: dto.isActive,
    categoryId: dto.categoryId,
    categoryName: dto.categoryName,
    measurementUnit: dto.measurementUnit,
    measurementValue: dto.measurementValue ?? undefined,
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString(),
  };
}

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductsService', 'ProductsFindAll')
  async findAll(data: { page?: number; limit?: number }) {
    const page = await this.productService.findAll(data.page, data.limit);
    return toPaginated(page, toGrpcProduct);
  }

  @GrpcMethod('ProductsService', 'ProductsFindOne')
  async findOne(data: { id: number }) {
    return toGrpcProduct(await this.productService.findById(data.id));
  }

  @GrpcMethod('ProductsService', 'ProductsCreate')
  async create(dto: CreateProductDto) {
    return toGrpcProduct(await this.productService.create(dto));
  }

  @GrpcMethod('ProductsService', 'ProductsUpdate')
  async update(data: { id: number } & UpdateProductDto) {
    const { id, ...dto } = data;
    return toGrpcProduct(await this.productService.update(id, dto));
  }

  @GrpcMethod('ProductsService', 'ProductsDelete')
  async delete(data: { id: number }) {
    await this.productService.delete(data.id);
    return { message: 'Producto eliminado' };
  }
}
