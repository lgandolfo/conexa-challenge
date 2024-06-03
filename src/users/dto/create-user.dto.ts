import { Role } from '../../helpers/enums/role';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: Role;
}
