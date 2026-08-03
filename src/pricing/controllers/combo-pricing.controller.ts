import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ComboPricingService } from '../services/combo-pricing.service';
import { GrpcExceptionFilter } from '../../common/filters/grpc-exception.filter';
import { toPaginated } from '../../common/grpc/paginate.util';
import { CreateComboPricingDto } from '../dto/create-combo-pricing.dto';
import { UpdateComboPricingDto } from '../dto/update-combo-pricing.dto';
import { ComboPricingResponseDto } from '../dto/combo-pricing-response.dto';

function toGrpcComboPricing(dto: ComboPricingResponseDto) {
  return {
    id: dto.id,
    comboId: dto.comboId,
    currency: dto.currency,
    unitPrice: dto.unitPrice,
    salePrice: dto.salePrice,
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString(),
  };
}

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class ComboPricingController {
  constructor(private readonly service: ComboPricingService) {}

  @GrpcMethod('ProductsService', 'ComboPricingCreate')
  async create(dto: CreateComboPricingDto) {
    return toGrpcComboPricing(await this.service.create(dto));
  }

  @GrpcMethod('ProductsService', 'ComboPricingFindAll')
  async findAll(data: { page?: number; limit?: number }) {
    const page = await this.service.findAll(data.page, data.limit);
    return toPaginated(page, toGrpcComboPricing);
  }

  @GrpcMethod('ProductsService', 'ComboPricingFindByCombo')
  async findByCombo(data: { comboId: number }) {
    return toGrpcComboPricing(await this.service.findByCombo(data.comboId));
  }

  @GrpcMethod('ProductsService', 'ComboPricingFindOne')
  async findOne(data: { id: number }) {
    return toGrpcComboPricing(await this.service.findOne(data.id));
  }

  @GrpcMethod('ProductsService', 'ComboPricingUpdate')
  async update(data: { id: number } & UpdateComboPricingDto) {
    const { id, ...dto } = data;
    return toGrpcComboPricing(await this.service.update(id, dto));
  }

  @GrpcMethod('ProductsService', 'ComboPricingDelete')
  async delete(data: { id: number }) {
    await this.service.remove(data.id);
    return { message: 'Pricing eliminado' };
  }
}
