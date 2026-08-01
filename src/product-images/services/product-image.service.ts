import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, QueryFailedError } from 'typeorm';

import { ProductImageEntity } from '../entities/product-image.entity';
import { ProductEntity } from '../../products/entities/product.entity';

import { CreateProductImageDto } from '../dto/create-product-image.dto';
import { UpdateProductImageDto } from '../dto/update-product-image.dto';
import { UploadProductImageDto } from '../dto/upload-product-image.dto';
import { ProductImageResponseDto } from '../dto/product-image-response.dto';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImageRepository: Repository<ProductImageEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    private readonly storageService: StorageService,
  ) {}

  // ==========================
  // CREATE (URL manual)
  // ==========================

  async create(dto: CreateProductImageDto): Promise<ProductImageResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new RpcException({
        status: 404,
        message: `Producto con id ${dto.productId} no encontrado`,
      });
    }

    await this.assertPositionFree(dto.productId, dto.position);

    try {
      const image = this.productImageRepository.create(dto);
      const saved = await this.productImageRepository.save(image);
      return new ProductImageResponseDto(saved);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new RpcException({
          status: 409,
          message: `Ya existe una imagen en la posición ${dto.position} para este producto`,
        });
      }
      throw err;
    }
  }

  // ==========================
  // UPLOAD (binario → Cloudinary)
  // ==========================

  async uploadImage(
    buffer: Buffer,
    dto: UploadProductImageDto,
  ): Promise<ProductImageResponseDto> {
    const product = await this.productRepository.findOne({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new RpcException({
        status: 404,
        message: `Producto con id ${dto.productId} no encontrado`,
      });
    }

    await this.assertPositionFree(dto.productId, dto.position);

    const { url, publicId } = await this.storageService.upload(
      buffer,
      'waiona/products',
    );

    const stillExists = await this.productRepository.findOne({
      where: { id: dto.productId },
    });
    if (!stillExists) {
      await this.storageService.delete(publicId).catch(() => undefined);
      throw new RpcException({
        status: 404,
        message: `Producto con id ${dto.productId} no encontrado`,
      });
    }

    try {
      await this.assertPositionFree(dto.productId, dto.position);
      const image = this.productImageRepository.create({
        productId: dto.productId,
        position: dto.position,
        url,
        publicId,
      });
      const saved = await this.productImageRepository.save(image);
      return new ProductImageResponseDto(saved);
    } catch (err) {
      await this.storageService.delete(publicId).catch(() => undefined);
      if (err instanceof QueryFailedError) {
        throw new RpcException({
          status: 409,
          message: `Ya existe una imagen en la posición ${dto.position} para este producto`,
        });
      }
      throw err;
    }
  }

  // ==========================
  // GET ALL BY PRODUCT
  // ==========================

  async findByProduct(productId: number): Promise<ProductImageResponseDto[]> {
    const images = await this.productImageRepository.find({
      where: { productId },
      order: { position: 'ASC' },
    });

    return images.map((image) => new ProductImageResponseDto(image));
  }

  // ==========================
  // GET BY ID
  // ==========================

  async findOne(id: number): Promise<ProductImageResponseDto> {
    return new ProductImageResponseDto(await this.findEntity(id));
  }

  // ==========================
  // UPDATE
  // ==========================

  async update(
    id: number,
    dto: UpdateProductImageDto,
  ): Promise<ProductImageResponseDto> {
    const image = await this.findEntity(id);

    if (dto.position !== undefined && dto.position !== image.position) {
      await this.assertPositionFree(image.productId, dto.position, id);
    }

    const merged = this.productImageRepository.merge(image, dto);

    try {
      const updated = await this.productImageRepository.save(merged);
      return new ProductImageResponseDto(updated);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new RpcException({
          status: 409,
          message: `Ya existe una imagen en la posición ${dto.position} para este producto`,
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
    await this.productImageRepository.softDelete(image.id);
    if (image.publicId) {
      await this.storageService.delete(image.publicId).catch(() => undefined);
    }
  }

  // ==========================
  // PRIVATE
  // ==========================

  private async findEntity(id: number): Promise<ProductImageEntity> {
    const image = await this.productImageRepository.findOne({
      where: { id },
    });
    if (!image) {
      throw new RpcException({
        status: 404,
        message: `Imagen de producto con id ${id} no encontrada`,
      });
    }
    return image;
  }

  private async assertPositionFree(
    productId: number,
    position: number,
    excludeId?: number,
  ): Promise<void> {
    const existing = await this.productImageRepository.findOne({
      where:
        excludeId !== undefined
          ? { productId, position, id: Not(excludeId) }
          : { productId, position },
    });
    if (existing) {
      throw new RpcException({
        status: 409,
        message: `Ya existe una imagen en la posición ${position} para este producto`,
      });
    }
  }
}
