import {
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateDiscountDto {
  @Transform(({ value }) => value?.toUpperCase().trim())
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase().trim())
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  description?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  value: number;
}
