import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
}
