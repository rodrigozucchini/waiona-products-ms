import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('categories.findAll')
  findAll(@Payload() data: { page?: number; limit?: number }) {
    return this.categoryService.findAll(data.page, data.limit);
  }

  @MessagePattern('categories.findTree')
  findTree() {
    return this.categoryService.getTree();
  }

  @MessagePattern('categories.findOne')
  findOne(@Payload() data: { id: number }) {
    return this.categoryService.findById(data.id);
  }

  @MessagePattern('categories.create')
  create(@Payload() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @MessagePattern('categories.update')
  update(@Payload() data: { id: number } & UpdateCategoryDto) {
    const { id, ...dto } = data;
    return this.categoryService.update(id, dto);
  }

  @MessagePattern('categories.delete')
  async delete(@Payload() data: { id: number }) {
    await this.categoryService.delete(data.id);
    return { message: 'Categoría eliminada' };
  }
}
