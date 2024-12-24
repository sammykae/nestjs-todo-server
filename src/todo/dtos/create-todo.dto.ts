import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoData {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  category?: string;

  @IsBoolean()
  @IsOptional()
  completed: boolean;
}
