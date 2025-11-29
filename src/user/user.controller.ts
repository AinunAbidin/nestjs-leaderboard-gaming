import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiBearerAuth('access-token')
  @Get('me')
  getUser(@GetUser() user: User) {
    return user;
  }

  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBearerAuth('access-token')
  @Patch('update')
  updateUser(@GetUser() user: User, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(user.id, dto);
  }

  @ApiOperation({ summary: 'Delete current user' })
  @ApiBearerAuth('access-token')
  @Delete('delete')
  deleteUser(@GetUser() user: User) {
    return this.userService.deleteUser(user.id);
  }
}
