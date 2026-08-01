import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TaxesService } from '../services/taxes.service';
import { CreateTaxDto } from '../dto/create-tax.dto';
import { UpdateTaxDto } from '../dto/update-tax.dto';

@Controller()
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  @MessagePattern('taxes.findAll')
  findAll(@Payload() data: { page?: number; limit?: number }) {
    return this.taxesService.findAll(data.page, data.limit);
  }

  @MessagePattern('taxes.findOne')
  findOne(@Payload() data: { id: number }) {
    return this.taxesService.findById(data.id);
  }

  @MessagePattern('taxes.create')
  create(@Payload() dto: CreateTaxDto) {
    return this.taxesService.create(dto);
  }

  @MessagePattern('taxes.update')
  update(@Payload() data: { id: number } & UpdateTaxDto) {
    const { id, ...dto } = data;
    return this.taxesService.update(id, dto);
  }

  @MessagePattern('taxes.delete')
  async delete(@Payload() data: { id: number }) {
    await this.taxesService.delete(data.id);
    return { message: 'Impuesto eliminado' };
  }
}
