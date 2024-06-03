import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Role } from '../helpers/enums/role';
import { User } from './entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockUser = {
  username: 'Test',
  email: 'test@gmail.com',
  role: Role.Regular,
  id: '1',
  password: 'Pass1234',
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn().mockResolvedValue(mockUser),
            findOneBy: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return user data', async () => {
      const result = await service.findOne(mockUser.email);

      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create new user', async () => {
      const createUserDto = {
        email: mockUser.email,
        password: mockUser.password,
        username: mockUser.username,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      const result = await service.createUser(createUserDto);

      expect(result).toEqual(mockUser);
    });

    it('should create new user fails user exists', async () => {
      const createUserDto = {
        email: mockUser.email,
        password: mockUser.password,
        username: mockUser.username,
      };

      try {
        await service.createUser(createUserDto);
      } catch (error) {
        expect((error as Error).message).toBe('User already exists');
      }
    });
  });

  describe('validateUser', () => {
    const createUserDto = {
      email: mockUser.email,
      password: mockUser.password,
      username: mockUser.username,
    };
    it('should return email is required', async () => {
      const result = await service.validateUser({
        ...createUserDto,
        email: '',
      });
      expect(result).toEqual('Email is required');
    });

    it('should return username is required', async () => {
      const result = await service.validateUser({
        ...createUserDto,
        username: '',
      });
      expect(result).toEqual('Username is required');
    });

    it('should return password is required', async () => {
      const result = await service.validateUser({
        ...createUserDto,
        password: '',
      });
      expect(result).toEqual('Password is required');
    });

    it('should return invalid email format', async () => {
      const result = await service.validateUser({
        ...createUserDto,
        email: 'test',
      });
      expect(result).toEqual('Invalid email format');
    });

    it('should return invalid email format', async () => {
      const result = await service.validateUser({
        ...createUserDto,
        password: 'pass',
      });
      expect(result).toEqual(
        'Invalid password, must contain 8 caracters, at least one uppercase and one number',
      );
    });
  });
});
