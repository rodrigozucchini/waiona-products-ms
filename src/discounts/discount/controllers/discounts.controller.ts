import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { DiscountsService } from '../services/discounts.service';
import { GrpcExceptionFilter } from '../../../common/filters/grpc-exception.filter';
import { toPaginated } from '../../../common/grpc/paginate.util';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';
import { DiscountResponseDto } from '../dto/discount-response.dto';

function toGrpcDiscount(dto: DiscountResponseDto) {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? undefined,
    value: dto.value,
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString(),
  };
}

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @GrpcMethod('ProductsService', 'DiscountsCreate')
  async create(dto: CreateDiscountDto) {
    return toGrpcDiscount(await this.discountsService.create(dto));
  }

  @GrpcMethod('ProductsService', 'DiscountsFindAll')
  async findAll(data: { page?: number; limit?: number }) {
    const page = await this.discountsService.findAll(data.page, data.limit);
    return toPaginated(page, toGrpcDiscount);
  }

  @GrpcMethod('ProductsService', 'DiscountsFindOne')
  async findOne(data: { id: number }) {
    return toGrpcDiscount(await this.discountsService.findOne(data.id));
  }

  @GrpcMethod('ProductsService', 'DiscountsUpdate')
  async update(data: { id: number } & UpdateDiscountDto) {
    const { id, ...dto } = data;
    return toGrpcDiscount(await this.discountsService.update(id, dto));
  }

  @GrpcMethod('ProductsService', 'DiscountsDelete')
  async delete(data: { id: number }) {
    await this.discountsService.remove(data.id);
    return { message: 'Descuento eliminado' };
  }
}
