import { IsInt, Min } from 'class-validator';

export class UploadProductImageDto {
  @IsInt()
  @Min(1)
  productId: number;

  @IsInt()
  @Min(1)
  position: number;
}
