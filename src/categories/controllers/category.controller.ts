import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { CategoryService } from '../services/category.service';
import { GrpcExceptionFilter } from '../../common/filters/grpc-exception.filter';
import { toPaginated } from '../../common/grpc/paginate.util';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { CategoryTreeResponseDto } from '../dto/category-tree-response.dto';

function toGrpcCategory(dto: CategoryResponseDto) {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? undefined,
    isActive: dto.isActive,
    parentId: dto.parentId ?? undefined,
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString(),
  };
}

function toGrpcTreeNode(dto: CategoryTreeResponseDto): unknown {
  return {
    id: dto.id,
    name: dto.name,
    children: dto.children.map(toGrpcTreeNode),
  };
}

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @GrpcMethod('ProductsService', 'CategoriesFindAll')
  async findAll(data: { page?: number; limit?: number }) {
    const page = await this.categoryService.findAll(data.page, data.limit);
    return toPaginated(page, toGrpcCategory);
  }

  @GrpcMethod('ProductsService', 'CategoriesFindTree')
  async findTree() {
    const roots = await this.categoryService.getTree();
    return { nodes: roots.map(toGrpcTreeNode) };
  }

  @GrpcMethod('ProductsService', 'CategoriesFindOne')
  async findOne(data: { id: number }) {
    return toGrpcCategory(await this.categoryService.findById(data.id));
  }

  @GrpcMethod('ProductsService', 'CategoriesCreate')
  async create(dto: CreateCategoryDto) {
    return toGrpcCategory(await this.categoryService.create(dto));
  }

  @GrpcMethod('ProductsService', 'CategoriesUpdate')
  async update(data: { id: number } & UpdateCategoryDto) {
    const { id, ...dto } = data;
    return toGrpcCategory(await this.categoryService.update(id, dto));
  }

  @GrpcMethod('ProductsService', 'CategoriesDelete')
  async delete(data: { id: number }) {
    await this.categoryService.delete(data.id);
    return { message: 'Categoría eliminada' };
  }
}
