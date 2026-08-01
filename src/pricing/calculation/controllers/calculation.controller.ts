import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CalculationService } from '../services/calculation.service';
import { CalculatePreviewDto } from '../dto/calculate-preview.dto';
import { CalculateProductDto } from '../dto/calculate-product.dto';
import { CalculateComboDto } from '../dto/calculate-combo.dto';

@Controller()
export class CalculationController {
  constructor(private readonly calculationService: CalculationService) {}

  @MessagePattern('pricing.calculate.preview')
  preview(@Payload() dto: CalculatePreviewDto) {
    return this.calculationService.preview(dto);
  }

  @MessagePattern('pricing.calculate.product')
  calculateProduct(@Payload() dto: CalculateProductDto) {
    return this.calculationService.calculateProduct(dto);
  }

  @MessagePattern('pricing.calculate.combo')
  calculateCombo(@Payload() dto: CalculateComboDto) {
    return this.calculationService.calculateCombo(dto);
  }
}
