/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const hashedPassword = await hash(password, 10);
    const createdUser = await this.usersService.create({
      email,
      password: hashedPassword,
      name: name ?? null,
    });

    const { password: _password, ...safeUser } = createdUser;
    void _password;
    return safeUser;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const { accessToken, refreshToken } = await this.generateTokens(
      payload.sub,
      payload.email,
    );
    const hashedRefreshToken = await hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    const safeUser = this.sanitizeUser(user);

    return {
      success: true,
      code: 200,
      message: 'success',
      data: {
        user: safeUser,
        accessToken,
        refreshToken,
        deviceId: null,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(refreshToken, {
        secret: this.refreshSecret,
      });

      const user = await this.usersService.findById(payload.sub);
      const rawStoredToken =
        typeof user === 'object' && user !== null
          ? (user as Record<string, unknown>)['refreshToken']
          : null;
      const storedRefreshToken =
        typeof rawStoredToken === 'string' ? rawStoredToken : null;

      if (!user || !storedRefreshToken) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      const isValid = await compare(refreshToken, storedRefreshToken);
      if (!isValid) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      const tokens = await this.generateTokens(user.id, user.email);
      const hashedRefreshToken = await hash(tokens.refreshToken, 10);
      await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

      const safeUser = this.sanitizeUser(user);

      return {
        success: true,
        code: 200,
        message: 'success',
        data: {
          user: safeUser,
          ...tokens,
          deviceId: null,
        },
      };
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }

  private async generateTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private get refreshSecret() {
    return (
      this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'refresh_secret'
    );
  }

  private get refreshExpiresIn() {
    return (
      this.configService.get<StringValue>('JWT_REFRESH_EXPIRES_IN') ?? '7d'
    );
  }

  private sanitizeUser(user: unknown) {
    if (!user || typeof user !== 'object') {
      return user;
    }

    const { password, refreshToken, ...rest } = user as Record<string, unknown>;
    void password;
    void refreshToken;
    return rest;
  }
}
