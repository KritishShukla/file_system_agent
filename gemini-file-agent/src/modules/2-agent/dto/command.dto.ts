import { IsString, IsNotEmpty } from 'class-validator';

export class CommandDto {
  @IsString()
  @IsNotEmpty()
  command: string;
}
