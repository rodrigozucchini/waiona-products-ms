import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('products.findAll')
  findAll(@Payload() data: { page?: number; limit?: number }) {
    return this.productService.findAll(data.page, data.limit);
  }

  @MessagePattern('products.findOne')
  findOne(@Payload() data: { id: number }) {
    return this.productService.findById(data.id);
  }

  @MessagePattern('products.create')
  create(@Payload() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @MessagePattern('products.update')
  update(@Payload() data: { id: number } & UpdateProductDto) {
    const { id, ...dto } = data;
    return this.productService.update(id, dto);
  }

  @MessagePattern('products.delete')
  async delete(@Payload() data: { id: number }) {
    await this.productService.delete(data.id);
    return { message: 'Producto eliminado' };
  }
}
