import { IsInt, Min } from 'class-validator';

export class UploadComboImageDto {
  @IsInt()
  @Min(1)
  comboId: number;

  @IsInt()
  @Min(1)
  position: number;
}
