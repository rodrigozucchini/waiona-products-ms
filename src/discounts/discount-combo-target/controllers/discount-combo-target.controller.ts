import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { DiscountComboTargetService } from '../services/discount-combo-target.service';
import { GrpcExceptionFilter } from '../../../common/filters/grpc-exception.filter';
import { toPaginated } from '../../../common/grpc/paginate.util';
import { CreateDiscountComboTargetDto } from '../dto/create-discount-combo-target.dto';
import { DiscountComboTargetResponseDto } from '../dto/discount-combo-target-response.dto';

function toGrpcTarget(dto: DiscountComboTargetResponseDto) {
  return {
    id: dto.id,
    discountId: dto.discountId,
    comboId: dto.comboId,
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString(),
  };
}

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class DiscountComboTargetController {
  constructor(private readonly service: DiscountComboTargetService) {}

  @GrpcMethod('ProductsService', 'DiscountComboTargetsCreate')
  async create(data: { discountId: number } & CreateDiscountComboTargetDto) {
    const { discountId, ...dto } = data;
    return toGrpcTarget(await this.service.create(discountId, dto));
  }

  @GrpcMethod('ProductsService', 'DiscountComboTargetsFindByDiscount')
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

  @GrpcMethod('ProductsService', 'DiscountComboTargetsDelete')
  async delete(data: { discountId: number; comboId: number }) {
    await this.service.remove(data.discountId, data.comboId);
    return { message: 'Combo quitado del descuento' };
  }
}
