import { Test, TestingModule } from '@nestjs/testing';
import { RoleGuard } from './role.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Role } from '../../helpers/enums/role';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RoleGuard>(RoleGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: Role.Regular },
        }),
      }),
    } as ExecutionContext;

    const canActivate = guard.canActivate(context);

    expect(canActivate).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalled();
  });

  it('should return true when user has required role', () => {
    const requiredRoles = [Role.Admin];
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: Role.Admin },
        }),
      }),
    } as ExecutionContext;

    const canActivate = guard.canActivate(context);

    expect(canActivate).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalled();
  });

  it('should return false when user does not have required role', () => {
    const requiredRoles = [Role.Admin];
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: Role.Regular },
        }),
      }),
    } as ExecutionContext;

    const canActivate = guard.canActivate(context);

    expect(canActivate).toBe(false);
    expect(reflector.getAllAndOverride).toHaveBeenCalled();
  });
});
