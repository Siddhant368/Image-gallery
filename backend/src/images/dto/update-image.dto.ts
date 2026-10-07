import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateImageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
}
