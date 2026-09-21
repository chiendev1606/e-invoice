import { UserPattern } from '@common/constants/enums/tcp-patterns.enum';
import { CreateUserRequestDto } from '@common/interfaces/gate-way/user/user.dto';
import { RequestTCP } from '@common/interfaces/tcp/request.interface';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from '../services/user.service';
import { ResponseTCP } from '@common/interfaces/tcp/response.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserPattern.CREATE)
  async createUser(data: RequestTCP<CreateUserRequestDto>) {
    return this.userService.createUser(data);
  }

  @MessagePattern(UserPattern.GET_BY_KEYCLOAK_ID)
  async getUserByKeycloakId(data: RequestTCP<string>) {
    return ResponseTCP.success(await this.userService.getUserByKeycloakId(data.data));
  }
}
