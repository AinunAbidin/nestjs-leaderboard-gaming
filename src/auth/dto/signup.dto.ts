import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'generated/prisma/client';

export class SignupDto {
  @ApiProperty({ example: 'PlayerOne' })
  @IsString()
  @IsNotEmpty()
  playerName: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ enum: Role, example: Role.PLAYER })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
