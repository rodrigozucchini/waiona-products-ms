import { DiscountEntity } from '../entities/discount.entity';

export class DiscountResponseDto {
  id: number;
  name: string;
  description?: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: DiscountEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description ?? undefined;
    this.value = Number(entity.value);
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
