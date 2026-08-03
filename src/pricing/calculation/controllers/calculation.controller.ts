import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { CalculationService } from '../services/calculation.service';
import { GrpcExceptionFilter } from '../../../common/filters/grpc-exception.filter';
import { CalculatePreviewDto } from '../dto/calculate-preview.dto';
import { CalculateProductDto } from '../dto/calculate-product.dto';
import { CalculateComboDto } from '../dto/calculate-combo.dto';

@Controller()
@UseFilters(new GrpcExceptionFilter())
export class CalculationController {
  constructor(private readonly calculationService: CalculationService) {}

  @GrpcMethod('ProductsService', 'PricingCalculatePreview')
  preview(dto: CalculatePreviewDto) {
    return this.calculationService.preview(dto);
  }

  @GrpcMethod('ProductsService', 'PricingCalculateProduct')
  calculateProduct(dto: CalculateProductDto) {
    return this.calculationService.calculateProduct(dto);
  }

  @GrpcMethod('ProductsService', 'PricingCalculateCombo')
  calculateCombo(dto: CalculateComboDto) {
    return this.calculationService.calculateCombo(dto);
  }
}
