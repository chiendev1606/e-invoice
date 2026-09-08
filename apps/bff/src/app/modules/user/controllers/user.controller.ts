import { ProcessID } from '@common/decorators/processID.decorator';
import { CreateUserRequestDto } from '@common/interfaces/gate-way/user/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() user: CreateUserRequestDto, @ProcessID() processID: string) {
    return this.userService.createUser(user, processID);
  }
}
