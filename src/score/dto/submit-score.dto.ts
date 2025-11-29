import { IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitScoreDto {
  @ApiProperty({
    example: 'PlayerOne',
    description: 'playerName yang akan dicatat skornya',
  })
  @IsString()
  playerName: string;

  @ApiProperty({ example: 12345, description: 'Nilai skor yang disubmit' })
  @IsInt()
  @Min(0)
  score: number;
}
