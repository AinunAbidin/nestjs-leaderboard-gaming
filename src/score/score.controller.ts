import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User, Role } from 'generated/prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { RateLimitGuard } from 'src/common/guards/rate-limit.guard';
import { SubmitScoreDto } from './dto';
import { ScoreService } from './score.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('scores')
@Controller()
export class ScoreController {
  constructor(
    private readonly scoreService: ScoreService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOperation({
    summary: 'Submit skor baru',
    description:
      'Player hanya bisa submit untuk dirinya. Admin boleh kirim untuk user lain lewat `userId`.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard, RateLimitGuard)
  @Post('scores')
  async submitScore(@GetUser() user: User, @Body() dto: SubmitScoreDto) {
    const targetPlayerName = dto.playerName ?? user.playerName;

    if (user.role !== Role.ADMIN && targetPlayerName !== user.playerName) {
      throw new ForbiddenException(
        'Players may only submit scores for themselves',
      );
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { playerName: targetPlayerName },
    });

    if (!targetUser) {
      throw new NotFoundException('Target player not found');
    }

    return this.scoreService.submitScore({
      userId: targetUser.id,
      value: dto.score,
    });
  }

  @ApiOperation({ summary: 'Ambil top 10 leaderboard' })
  @Get('leaderboard')
  async getLeaderboard() {
    return this.scoreService.getLeaderboard(10);
  }
}
