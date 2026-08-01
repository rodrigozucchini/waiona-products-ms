import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { DiscountComboTargetService } from '../services/discount-combo-target.service';
import { CreateDiscountComboTargetDto } from '../dto/create-discount-combo-target.dto';

@Controller()
export class DiscountComboTargetController {
  constructor(private readonly service: DiscountComboTargetService) {}

  @MessagePattern('discount-combo-targets.create')
  create(
    @Payload() data: { discountId: number } & CreateDiscountComboTargetDto,
  ) {
    const { discountId, ...dto } = data;
    return this.service.create(discountId, dto);
  }

  @MessagePattern('discount-combo-targets.findByDiscount')
  findAll(
    @Payload() data: { discountId: number; page?: number; limit?: number },
  ) {
    return this.service.findAll(data.discountId, data.page, data.limit);
  }

  @MessagePattern('discount-combo-targets.delete')
  async remove(@Payload() data: { discountId: number; comboId: number }) {
    await this.service.remove(data.discountId, data.comboId);
    return { message: 'Combo quitado del descuento' };
  }
}
