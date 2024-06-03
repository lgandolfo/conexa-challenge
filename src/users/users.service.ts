import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/users.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { isValidPassword } from '../helpers/validations/password';
import { isValidEmail } from '../helpers/validations/email';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existUser = await this.findOne(createUserDto.email);
    if (existUser) {
      throw Error('User already exists');
    }
    const hashPassword = bcrypt.hashSync(createUserDto.password, 10);
    const user = await this.usersRepository.save({
      ...createUserDto,
      password: hashPassword,
    });
    return user;
  }

  async findOne(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  comparePassword(password: string, storedPassword: string): boolean {
    const areEquals = bcrypt.compareSync(password, storedPassword);
    return areEquals;
  }

  validateUser(createUserDto: CreateUserDto): null | string {
    const { email, username, password } = createUserDto;
    if (!email) return 'Email is required';
    if (!username) return 'Username is required';
    if (!password) return 'Password is required';
    if (!isValidEmail(email)) return 'Invalid email format';
    if (!isValidPassword(password))
      return 'Invalid password, must contain 8 caracters, at least one uppercase and one number';
    return null;
  }
}
