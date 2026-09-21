import { ProcessID } from '@common/decorators/processID.decorator';
import { CreateUserRequestDto } from '@common/interfaces/gate-way/user/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiProperty({ description: 'Create a new user' })
  async createUser(@Body() user: CreateUserRequestDto, @ProcessID() processID: string) {
    return this.userService.createUser(user, processID);
  }
}
