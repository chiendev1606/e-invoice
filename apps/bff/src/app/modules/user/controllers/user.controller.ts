import { ProcessID } from '@common/decorators/processID.decorator';
import { CreateUserRequestDto } from '@common/interfaces/gate-way/user/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from '@common/interfaces/gate-way/keycloak';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiProperty()
  async createUser(@Body() user: CreateUserRequestDto, @ProcessID() processID: string) {
    return this.userService.createUser(user, processID);
  }

  @Post('/login')
  async login(@Body() data: LoginRequestDto, @ProcessID() processID: string) {
    return this.userService.login(data, processID);
  }
}
