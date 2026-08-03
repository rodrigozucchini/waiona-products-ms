import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { TaxesService } from '../services/taxes.service';
import { GrpcExceptionFilter } from '../../../common/filters/grpc-exception.filter';
import { toPaginated } from '../../../common/grpc/paginate.util';
import { CreateTaxDto } from '../dto/create-tax.dto';
import { UpdateTaxDto } from '../dto/update-tax.dto';
import { TaxResponseDto } from '../dto/tax-response.dto';

export function toGrpcTax(dto: TaxResponseDto) {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    value: dto.value,
    isGlobal: dto.isGlobal,
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString(),
  };
}

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  @GrpcMethod('ProductsService', 'TaxesFindAll')
  async findAll(data: { page?: number; limit?: number }) {
    const page = await this.taxesService.findAll(data.page, data.limit);
    return toPaginated(page, toGrpcTax);
  }

  @GrpcMethod('ProductsService', 'TaxesFindOne')
  async findOne(data: { id: number }) {
    return toGrpcTax(await this.taxesService.findById(data.id));
  }

  @GrpcMethod('ProductsService', 'TaxesCreate')
  async create(dto: CreateTaxDto) {
    return toGrpcTax(await this.taxesService.create(dto));
  }

  @GrpcMethod('ProductsService', 'TaxesUpdate')
  async update(data: { id: number } & UpdateTaxDto) {
    const { id, ...dto } = data;
    return toGrpcTax(await this.taxesService.update(id, dto));
  }

  @GrpcMethod('ProductsService', 'TaxesDelete')
  async delete(data: { id: number }) {
    await this.taxesService.delete(data.id);
    return { message: 'Impuesto eliminado' };
  }
}
