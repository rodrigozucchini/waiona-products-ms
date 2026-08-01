import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { DiscountProductTargetService } from '../services/discount-product-target.service';
import { CreateDiscountProductTargetDto } from '../dto/create-discount-product-target.dto';

@Controller()
export class DiscountProductTargetController {
  constructor(private readonly service: DiscountProductTargetService) {}

  @MessagePattern('discount-product-targets.create')
  create(
    @Payload() data: { discountId: number } & CreateDiscountProductTargetDto,
  ) {
    const { discountId, ...dto } = data;
    return this.service.create(discountId, dto);
  }

  @MessagePattern('discount-product-targets.findByDiscount')
  findAll(
    @Payload() data: { discountId: number; page?: number; limit?: number },
  ) {
    return this.service.findAll(data.discountId, data.page, data.limit);
  }

  @MessagePattern('discount-product-targets.delete')
  async remove(@Payload() data: { discountId: number; productId: number }) {
    await this.service.remove(data.discountId, data.productId);
    return { message: 'Producto quitado del descuento' };
  }
}
