import {
  IsString,
  IsNotEmpty,
  Length,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTaxDto {
  @Transform(({ value }) => value?.toUpperCase().trim())
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  code: string;

  @Transform(({ value }) => value?.toUpperCase().trim())
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  value: number;

  @IsOptional()
  @IsBoolean()
  isGlobal?: boolean;
}
