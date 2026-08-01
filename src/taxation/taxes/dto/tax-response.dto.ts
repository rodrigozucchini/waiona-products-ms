import { TaxEntity } from '../entities/tax.entity';

export class TaxResponseDto {
  id: number;
  code: string;
  name: string;
  value: number;
  isGlobal: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: TaxEntity) {
    this.id = entity.id;
    this.code = entity.code;
    this.name = entity.name;
    this.value = Number(entity.value);
    this.isGlobal = entity.isGlobal;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
