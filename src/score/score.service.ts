import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScoreService {
  constructor(private prisma: PrismaService) {}

  async submitScore(input: { userId: number; value: number }) {
    return this.prisma.score.create({
      data: {
        value: input.value,
        userId: input.userId,
      },
      select: {
        id: true,
        value: true,
        userId: true,
        createdAt: true,
        user: {
          select: { playerName: true },
        },
      },
    });
  }

  async getLeaderboard(limit = 10) {
    const scores = await this.prisma.score.findMany({
      select: {
        value: true,
        user: { select: { playerName: true } },
      },
      orderBy: [{ value: 'desc' }, { createdAt: 'asc' }],
      distinct: ['userId'],
      take: limit,
    });

    return scores.map((score, index) => ({
      ranking: index + 1,
      playerName: score.user.playerName,
      score: score.value,
    }));
  }
}
