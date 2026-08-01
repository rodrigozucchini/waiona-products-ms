import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ComboPricingService } from '../services/combo-pricing.service';
import { CreateComboPricingDto } from '../dto/create-combo-pricing.dto';
import { UpdateComboPricingDto } from '../dto/update-combo-pricing.dto';

@Controller()
export class ComboPricingController {
  constructor(private readonly service: ComboPricingService) {}

  @MessagePattern('combo-pricing.create')
  create(@Payload() dto: CreateComboPricingDto) {
    return this.service.create(dto);
  }

  @MessagePattern('combo-pricing.findAll')
  findAll(@Payload() data: { page?: number; limit?: number }) {
    return this.service.findAll(data.page, data.limit);
  }

  @MessagePattern('combo-pricing.findByCombo')
  findByCombo(@Payload() data: { comboId: number }) {
    return this.service.findByCombo(data.comboId);
  }

  @MessagePattern('combo-pricing.findOne')
  findOne(@Payload() data: { id: number }) {
    return this.service.findOne(data.id);
  }

  @MessagePattern('combo-pricing.update')
  update(@Payload() data: { id: number } & UpdateComboPricingDto) {
    const { id, ...dto } = data;
    return this.service.update(id, dto);
  }

  @MessagePattern('combo-pricing.delete')
  async remove(@Payload() data: { id: number }) {
    await this.service.remove(data.id);
    return { message: 'Pricing eliminado' };
  }
}
