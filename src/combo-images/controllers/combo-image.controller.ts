import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ComboImageService } from '../services/combo-image.service';
import { CreateComboImageDto } from '../dto/create-combo-image.dto';
import { UpdateComboImageDto } from '../dto/update-combo-image.dto';
import { UploadComboImageDto } from '../dto/upload-combo-image.dto';

@Controller()
export class ComboImageController {
  constructor(private readonly comboImageService: ComboImageService) {}

  @MessagePattern('combo-images.create')
  create(@Payload() dto: CreateComboImageDto) {
    return this.comboImageService.create(dto);
  }

  @MessagePattern('combo-images.upload')
  upload(@Payload() data: { buffer: string } & UploadComboImageDto) {
    const { buffer, ...dto } = data;
    return this.comboImageService.uploadImage(
      Buffer.from(buffer, 'base64'),
      dto,
    );
  }

  @MessagePattern('combo-images.findByCombo')
  findByCombo(@Payload() data: { comboId: number }) {
    return this.comboImageService.findByCombo(data.comboId);
  }

  @MessagePattern('combo-images.findOne')
  findOne(@Payload() data: { id: number }) {
    return this.comboImageService.findOne(data.id);
  }

  @MessagePattern('combo-images.update')
  update(@Payload() data: { id: number } & UpdateComboImageDto) {
    const { id, ...dto } = data;
    return this.comboImageService.update(id, dto);
  }

  @MessagePattern('combo-images.delete')
  async remove(@Payload() data: { id: number }) {
    await this.comboImageService.remove(data.id);
    return { message: 'Imagen eliminada' };
  }
}
