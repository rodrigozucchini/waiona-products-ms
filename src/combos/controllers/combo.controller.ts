import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { ComboService } from '../services/combo.service';
import { GrpcExceptionFilter } from '../../common/filters/grpc-exception.filter';
import { toPaginated } from '../../common/grpc/paginate.util';
import { CreateComboDto } from '../dto/create-combo.dto';
import { UpdateComboDto } from '../dto/update-combo.dto';
import { ComboResponseDto } from '../dto/combo-response.dto';

function toGrpcCombo(dto: ComboResponseDto) {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    isActive: dto.isActive,
    categoryId: dto.categoryId,
    categoryName: dto.categoryName,
    items: dto.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
    })),
    createdAt: dto.createdAt.toISOString(),
    updatedAt: dto.updatedAt.toISOString(),
  };
}

interface ComboItemData {
  productId: number;
  quantity: number;
}

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class ComboController {
  constructor(private readonly comboService: ComboService) {}

  @GrpcMethod('ProductsService', 'CombosFindAll')
  async findAll(data: { page?: number; limit?: number }) {
    const page = await this.comboService.findAll(data.page, data.limit);
    return toPaginated(page, toGrpcCombo);
  }

  @GrpcMethod('ProductsService', 'CombosFindOne')
  async findOne(data: { id: number }) {
    return toGrpcCombo(await this.comboService.findById(data.id));
  }

  @GrpcMethod('ProductsService', 'CombosCreate')
  async create(dto: CreateComboDto) {
    return toGrpcCombo(await this.comboService.create(dto));
  }

  @GrpcMethod('ProductsService', 'CombosUpdate')
  async update(data: {
    id: number;
    name?: string;
    description?: string;
    isActive?: boolean;
    categoryId?: number;
    items?: { items: ComboItemData[] };
  }) {
    const { id, items, ...rest } = data;

    // El wrapper de `items` no pasa por el ValidationPipe global (ver nota
    // en products.proto sobre por qué está envuelto) — se valida a mano acá
    // para no perder las mismas garantías que tenía el DTO original.
    const dto = plainToInstance(UpdateComboDto, {
      ...rest,
      items: items?.items,
    });
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new RpcException({
        status: 400,
        message: errors
          .flatMap((e) => Object.values(e.constraints ?? {}))
          .join('; '),
      });
    }

    return toGrpcCombo(await this.comboService.update(id, dto));
  }

  @GrpcMethod('ProductsService', 'CombosDelete')
  async delete(data: { id: number }) {
    await this.comboService.delete(data.id);
    return { message: 'Combo eliminado' };
  }
}
