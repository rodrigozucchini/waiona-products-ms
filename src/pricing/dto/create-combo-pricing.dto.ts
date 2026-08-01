import { IsInt, IsEnum, IsNumber, Min } from 'class-validator';
import { CurrencyCode } from '../../common/enums/currency-code.enum';

export class CreateComboPricingDto {
  @IsInt()
  @Min(1)
  comboId: number;

  @IsEnum(CurrencyCode)
  currency: CurrencyCode;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  unitPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  salePrice: number;
}
