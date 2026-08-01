import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { DiscountsService } from '../services/discounts.service';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';

@Controller()
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @MessagePattern('discounts.create')
  create(@Payload() dto: CreateDiscountDto) {
    return this.discountsService.create(dto);
  }

  @MessagePattern('discounts.findAll')
  findAll(@Payload() data: { page?: number; limit?: number }) {
    return this.discountsService.findAll(data.page, data.limit);
  }

  @MessagePattern('discounts.findOne')
  findOne(@Payload() data: { id: number }) {
    return this.discountsService.findOne(data.id);
  }

  @MessagePattern('discounts.update')
  update(@Payload() data: { id: number } & UpdateDiscountDto) {
    const { id, ...dto } = data;
    return this.discountsService.update(id, dto);
  }

  @MessagePattern('discounts.delete')
  async remove(@Payload() data: { id: number }) {
    await this.discountsService.remove(data.id);
    return { message: 'Descuento eliminado' };
  }
}
