import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(userId: number, dto: UpdateUserDto) {
    if (dto.playerName) {
      const nameExists = await this.prisma.user.findFirst({
        where: { playerName: dto.playerName, id: { not: userId } },
      });
      if (nameExists) {
        throw new ForbiddenException('playerName already in use');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
    const {
      password: _password,
      hashedRt: _hashedRt,
      ...userWithoutPassword
    } = updatedUser;
    void _password;
    void _hashedRt;
    return userWithoutPassword;
  }

  async deleteUser(userId: number) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { message: 'User deleted' };
  }
}
