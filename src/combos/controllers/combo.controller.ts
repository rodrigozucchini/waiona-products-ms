import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ComboService } from '../services/combo.service';
import { CreateComboDto } from '../dto/create-combo.dto';
import { UpdateComboDto } from '../dto/update-combo.dto';

@Controller()
export class ComboController {
  constructor(private readonly comboService: ComboService) {}

  @MessagePattern('combos.findAll')
  findAll(@Payload() data: { page?: number; limit?: number }) {
    return this.comboService.findAll(data.page, data.limit);
  }

  @MessagePattern('combos.findOne')
  findOne(@Payload() data: { id: number }) {
    return this.comboService.findById(data.id);
  }

  @MessagePattern('combos.create')
  create(@Payload() dto: CreateComboDto) {
    return this.comboService.create(dto);
  }

  @MessagePattern('combos.update')
  update(@Payload() data: { id: number } & UpdateComboDto) {
    const { id, ...dto } = data;
    return this.comboService.update(id, dto);
  }

  @MessagePattern('combos.delete')
  async delete(@Payload() data: { id: number }) {
    await this.comboService.delete(data.id);
    return { message: 'Combo eliminado' };
  }
}
