import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './services/auth.service';
import { UsersService } from '../users/users.service';
import { Role } from '../helpers/enums/role';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  login(@Body() loginInDto: { email: string; password: string }) {
    return this.authService.login(loginInDto.email, loginInDto.password);
  }

  @Post('sign-up')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const validateUser = this.usersService.validateUser(createUserDto);
    if (validateUser) throw new BadRequestException(validateUser);
    try {
      const user = await this.usersService.createUser({
        ...createUserDto,
        role: Role.Regular,
      });
      return user;
    } catch (error) {
      return new BadRequestException(error);
    }
  }
}
