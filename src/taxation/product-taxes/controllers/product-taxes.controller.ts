import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ProductTaxesService } from '../services/product-taxes.service';
import { GrpcExceptionFilter } from '../../../common/filters/grpc-exception.filter';
import { toPaginated } from '../../../common/grpc/paginate.util';
import { toGrpcTax } from '../../taxes/controllers/taxes.controller';
import { CreateProductTaxDto } from '../dto/create-product-tax.dto';
import { UpdateProductTaxDto } from '../dto/update-product-tax.dto';
import { ProductTaxResponseDto } from '../dto/product-tax-response.dto';

function toGrpcProductTax(dto: ProductTaxResponseDto) {
  return {
    id: dto.id,
    productId: dto.productId,
    taxId: dto.taxId,
    tax: dto.tax ? toGrpcTax(dto.tax) : undefined,
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString(),
  };
}

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class ProductTaxesController {
  constructor(private readonly productTaxesService: ProductTaxesService) {}

  @GrpcMethod('ProductsService', 'ProductTaxesCreate')
  async create(data: { productId: number } & CreateProductTaxDto) {
    return toGrpcProductTax(await this.productTaxesService.create(data));
  }

  @GrpcMethod('ProductsService', 'ProductTaxesFindByProduct')
  async findAll(data: {
    productId: number;
    page?: number;
    limit?: number;
  }) {
    const page = await this.productTaxesService.findAll(
      data.productId,
      data.page,
      data.limit,
    );
    return toPaginated(page, toGrpcProductTax);
  }

  @GrpcMethod('ProductsService', 'ProductTaxesFindOne')
  async findOne(data: { id: number }) {
    return toGrpcProductTax(await this.productTaxesService.findOne(data.id));
  }

  @GrpcMethod('ProductsService', 'ProductTaxesUpdate')
  async update(data: { id: number } & UpdateProductTaxDto) {
    const { id, ...dto } = data;
    return toGrpcProductTax(await this.productTaxesService.update(id, dto));
  }

  @GrpcMethod('ProductsService', 'ProductTaxesDelete')
  async delete(data: { id: number }) {
    await this.productTaxesService.remove(data.id);
    return { message: 'Impuesto de producto eliminado' };
  }
}
