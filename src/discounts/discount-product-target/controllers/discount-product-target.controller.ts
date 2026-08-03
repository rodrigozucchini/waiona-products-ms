import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { DiscountProductTargetService } from '../services/discount-product-target.service';
import { GrpcExceptionFilter } from '../../../common/filters/grpc-exception.filter';
import { toPaginated } from '../../../common/grpc/paginate.util';
import { CreateDiscountProductTargetDto } from '../dto/create-discount-product-target.dto';
import { DiscountProductTargetResponseDto } from '../dto/discount-product-target-response.dto';

function toGrpcTarget(dto: DiscountProductTargetResponseDto) {
  return {
    id: dto.id,
    discountId: dto.discountId,
    productId: dto.productId,
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString(),
  };
}

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class DiscountProductTargetController {
  constructor(private readonly service: DiscountProductTargetService) {}

  @GrpcMethod('ProductsService', 'DiscountProductTargetsCreate')
  async create(data: { discountId: number } & CreateDiscountProductTargetDto) {
    const { discountId, ...dto } = data;
    return toGrpcTarget(await this.service.create(discountId, dto));
  }

  @GrpcMethod('ProductsService', 'DiscountProductTargetsFindByDiscount')
  async findAll(data: {
    discountId: number;
    page?: number;
    limit?: number;
  }) {
    const page = await this.service.findAll(
      data.discountId,
      data.page,
      data.limit,
    );
    return toPaginated(page, toGrpcTarget);
  }

  @GrpcMethod('ProductsService', 'DiscountProductTargetsDelete')
  async delete(data: { discountId: number; productId: number }) {
    await this.service.remove(data.discountId, data.productId);
    return { message: 'Producto quitado del descuento' };
  }
}
