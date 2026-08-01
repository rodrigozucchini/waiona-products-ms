import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProductTaxesService } from '../services/product-taxes.service';
import { CreateProductTaxDto } from '../dto/create-product-tax.dto';
import { UpdateProductTaxDto } from '../dto/update-product-tax.dto';

@Controller()
export class ProductTaxesController {
  constructor(private readonly productTaxesService: ProductTaxesService) {}

  @MessagePattern('product-taxes.create')
  create(@Payload() data: { productId: number } & CreateProductTaxDto) {
    return this.productTaxesService.create(data);
  }

  @MessagePattern('product-taxes.findByProduct')
  findAll(
    @Payload() data: { productId: number; page?: number; limit?: number },
  ) {
    return this.productTaxesService.findAll(data.productId, data.page, data.limit);
  }

  @MessagePattern('product-taxes.findOne')
  findOne(@Payload() data: { id: number }) {
    return this.productTaxesService.findOne(data.id);
  }

  @MessagePattern('product-taxes.update')
  update(@Payload() data: { id: number } & UpdateProductTaxDto) {
    const { id, ...dto } = data;
    return this.productTaxesService.update(id, dto);
  }

  @MessagePattern('product-taxes.delete')
  async remove(@Payload() data: { id: number }) {
    await this.productTaxesService.remove(data.id);
    return { message: 'Impuesto de producto eliminado' };
  }
}
