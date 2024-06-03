import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UsersService } from '../users/users.service';
import { Role } from '../helpers/enums/role';
import { BadRequestException } from '@nestjs/common';

const mockUser = {
  username: 'Test',
  email: 'test@gmail.com',
  role: Role.Regular,
  id: '1',
  password: 'Pass1234',
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findOne: jest.fn(),
            validateUser: jest.fn(),
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return login data', async () => {
      const loginData = {
        email: 'test@gmail.com',
        password: 'Pass1234',
      };
      const expectedResult = {
        accessToken: 'token',
        user: mockUser,
      };
      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(loginData);

      expect(result).toEqual(expectedResult);
      expect(authService.login).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
      );
    });
  });

  describe('signup', () => {
    it('should signup return error', async () => {
      const signupData = {
        email: 'test',
        password: mockUser.password,
        username: mockUser.username,
      };

      jest
        .spyOn(usersService, 'validateUser')
        .mockReturnValue('Invalid email format');

      try {
        await controller.createUser(signupData);
      } catch (error) {
        expect(
          (error as BadRequestException).getResponse() as string,
        ).toMatchObject(
          new BadRequestException('Invalid email format').getResponse(),
        );
      }

      expect(usersService.createUser).not.toHaveBeenCalledWith();
    });

    it('should signup success', async () => {
      const signupData = {
        email: mockUser.email,
        password: mockUser.password,
        username: mockUser.username,
      };

      jest.spyOn(usersService, 'validateUser').mockReturnValue('');
      jest.spyOn(usersService, 'createUser').mockResolvedValue(mockUser);

      const result = await controller.createUser(signupData);
      expect(result).toEqual(mockUser);
      expect(usersService.createUser).toHaveBeenCalledWith({
        ...signupData,
        role: Role.Regular,
      });
    });
  });
});
