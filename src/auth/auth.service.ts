import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, SignupDto } from './dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(body: SignupDto) {
    const password = await argon2.hash(body.password);
    const existing = await this.prisma.user.findFirst({
      where: {
        playerName: body.playerName,
      },
    });
    if (existing) {
      throw new ForbiddenException('playerName already taken');
    }

    const user = await this.prisma.user.create({
      data: {
        playerName: body.playerName,
        password,
        role: body.role,
      },
    });
    const tokens = await this.signTokens(user.id, user.playerName);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signin(body: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        playerName: body.playerName,
      },
    });
    if (!user) {
      throw new ForbiddenException('Not Found User');
    }
    const pwdMatch = await argon2.verify(user.password, body.password);
    if (!pwdMatch) {
      throw new ForbiddenException('Wrong Credentials');
    }
    const tokens = await this.signTokens(user.id, user.playerName);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return { message: 'Logged out' };
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await argon2.verify(user.hashedRt, rt);
    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.signTokens(user.id, user.playerName);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signTokens(
    userId: number,
    playerName: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const data = {
      sub: userId,
      playerName,
    };

    const accessSecret = this.config.get<string>('JWT_SECRET');
    const refreshSecret =
      this.config.get<string>('JWT_REFRESH_SECRET') ?? accessSecret;

    if (!accessSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(data, {
        expiresIn: '15m',
        secret: accessSecret,
      }),
      this.jwt.signAsync(data, {
        expiresIn: '7d',
        secret: refreshSecret,
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  private async updateRtHash(userId: number, rt: string) {
    const hash = await argon2.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }
}
