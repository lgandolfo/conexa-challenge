import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/users.service';
import { Role } from '../../helpers/enums/role';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

const mockUser = {
  username: 'Test',
  email: 'test@gmail.com',
  role: Role.Regular,
  id: '1',
  password: '',
};

const token = 'token';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findOne: jest.fn(),
            validateUser: jest.fn(),
            comparePassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(token),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'comparePassword').mockReturnValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.login(loginData.email, loginData.password);

      expect(result).toEqual(expectedResult);
    });

    it('should return return unauthorize error', async () => {
      const loginData = {
        email: 'test@gmail.com',
        password: 'Pass1234',
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      try {
        await service.login(loginData.email, loginData.password);
      } catch (error) {
        expect(
          (error as UnauthorizedException).getResponse() as string,
        ).toMatchObject(
          new UnauthorizedException(
            'Username or password invalid',
          ).getResponse(),
        );
      }
      expect(jwtService.sign).not.toHaveBeenCalledWith();
    });

    it('should return return unauthorize error for invalid password', async () => {
      const loginData = {
        email: 'test@gmail.com',
        password: 'Pass1234',
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'comparePassword').mockReturnValue(false);

      try {
        await service.login(loginData.email, loginData.password);
      } catch (error) {
        expect(
          (error as UnauthorizedException).getResponse() as string,
        ).toMatchObject(
          new UnauthorizedException(
            'Username or password invalid',
          ).getResponse(),
        );
      }
      expect(jwtService.sign).not.toHaveBeenCalledWith();
    });
  });
});
