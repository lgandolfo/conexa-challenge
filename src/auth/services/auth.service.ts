import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/users.entity';
import { Role } from '../../helpers/enums/role';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user: User = await this.usersService.findOne(email);
    if (user) {
      const hasValidPassword = await this.usersService.comparePassword(
        password,
        user.password,
      );
      if (hasValidPassword) {
        return user;
      }
    }
    return null;
  }

  createToken(userId: string, role: Role): string {
    const expiresIn = this.configService.get<string>('EXPIRES_IN');
    const secret = this.configService.get<string>('TOKEN_SECRET');
    const userInfo = { userId, role };
    const token: string = this.jwtService.sign(userInfo, {
      expiresIn,
      secret,
    });
    return token;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Username or password invalid');
    }
    const accessToken = this.createToken(user.id, user.role);
    return {
      accessToken,
      user,
    };
  }
}
