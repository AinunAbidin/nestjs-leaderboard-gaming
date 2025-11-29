import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignupDto } from './dto';
import { GetUser } from './decorator';
import { JwtGuard, JwtRefreshGuard } from './guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary:
      'Login user (playerName + password), returns access & refresh tokens',
  })
  @Post('signin')
  signin(@Body() body: AuthDto) {
    return this.authService.signin(body);
  }

  @ApiOperation({
    summary: 'Register new user (playerName), returns access & refresh tokens',
  })
  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @Post('logout')
  logout(@GetUser('id') userId: number) {
    return this.authService.logout(userId);
  }

  @ApiOperation({ summary: 'Refresh tokens using refresh token' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@GetUser('sub') userId: number, @GetUser('refreshToken') rt: string) {
    return this.authService.refreshTokens(userId, rt);
  }
}
