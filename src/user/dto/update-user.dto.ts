import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'generated/prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'NewPlayerName' })
  @IsString()
  @IsOptional()
  playerName?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.ADMIN })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
