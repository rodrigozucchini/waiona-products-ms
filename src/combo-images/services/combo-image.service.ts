import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, QueryFailedError } from 'typeorm';

import { ComboImageEntity } from '../entities/combo-image.entity';
import { ComboEntity } from '../../combos/entities/combo.entity';

import { CreateComboImageDto } from '../dto/create-combo-image.dto';
import { UpdateComboImageDto } from '../dto/update-combo-image.dto';
import { ComboImageResponseDto } from '../dto/combo-image-response.dto';

@Injectable()
export class ComboImageService {
  constructor(
    @InjectRepository(ComboImageEntity)
    private readonly comboImageRepository: Repository<ComboImageEntity>,

    @InjectRepository(ComboEntity)
    private readonly comboRepository: Repository<ComboEntity>,
  ) {}

  // ==========================
  // CREATE (URL manual)
  // ==========================

  async create(dto: CreateComboImageDto): Promise<ComboImageResponseDto> {
    const combo = await this.comboRepository.findOne({
      where: { id: dto.comboId },
    });

    if (!combo) {
      throw new RpcException({
        status: 404,
        message: `Combo con id ${dto.comboId} no encontrado`,
      });
    }

    await this.assertPositionFree(dto.comboId, dto.position);

    try {
      const image = this.comboImageRepository.create(dto);
      const saved = await this.comboImageRepository.save(image);
      return new ComboImageResponseDto(saved);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new RpcException({
          status: 409,
          message: `Ya existe una imagen en la posición ${dto.position} para este combo`,
        });
      }
      throw err;
    }
  }

  // ==========================
  // GET ALL BY COMBO
  // ==========================

  async findByCombo(comboId: number): Promise<ComboImageResponseDto[]> {
    const images = await this.comboImageRepository.find({
      where: { comboId },
      order: { position: 'ASC' },
    });

    return images.map((image) => new ComboImageResponseDto(image));
  }

  // ==========================
  // GET BY ID
  // ==========================

  async findOne(id: number): Promise<ComboImageResponseDto> {
    return new ComboImageResponseDto(await this.findEntity(id));
  }

  // ==========================
  // UPDATE
  // ==========================

  async update(
    id: number,
    dto: UpdateComboImageDto,
  ): Promise<ComboImageResponseDto> {
    const image = await this.findEntity(id);

    if (dto.position !== undefined && dto.position !== image.position) {
      await this.assertPositionFree(image.comboId, dto.position, id);
    }

    const merged = this.comboImageRepository.merge(image, dto);

    try {
      const updated = await this.comboImageRepository.save(merged);
      return new ComboImageResponseDto(updated);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new RpcException({
          status: 409,
          message: `Ya existe una imagen en la posición ${dto.position} para este combo`,
        });
      }
      throw err;
    }
  }

  // ==========================
  // DELETE (soft)
  // ==========================

  async remove(id: number): Promise<void> {
    const image = await this.findEntity(id);
    await this.comboImageRepository.softDelete(image.id);
  }

  // ==========================
  // PRIVATE
  // ==========================

  private async findEntity(id: number): Promise<ComboImageEntity> {
    const image = await this.comboImageRepository.findOne({
      where: { id },
    });
    if (!image) {
      throw new RpcException({
        status: 404,
        message: `Imagen de combo con id ${id} no encontrada`,
      });
    }
    return image;
  }

  private async assertPositionFree(
    comboId: number,
    position: number,
    excludeId?: number,
  ): Promise<void> {
    const existing = await this.comboImageRepository.findOne({
      where:
        excludeId !== undefined
          ? { comboId, position, id: Not(excludeId) }
          : { comboId, position },
    });
    if (existing) {
      throw new RpcException({
        status: 409,
        message: `Ya existe una imagen en la posición ${position} para este combo`,
      });
    }
  }
}
