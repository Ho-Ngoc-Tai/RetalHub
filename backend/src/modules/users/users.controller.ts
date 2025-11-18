import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => {
      const { password, ...safeUser } = user as { password?: string };
      void password;
      return safeUser;
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...safeUser } = user as { password?: string };
    void password;
    return safeUser;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const updated = await this.usersService.update(id, body);
    const { password, ...safeUser } = updated as { password?: string };
    void password;
    return safeUser;
  }
}
