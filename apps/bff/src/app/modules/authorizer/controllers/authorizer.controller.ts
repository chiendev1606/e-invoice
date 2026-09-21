import { ProcessID } from '@common/decorators/processID.decorator';
import { LoginRequestDto } from '@common/interfaces/gate-way/keycloak';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthorizerService } from '../services/authorizer.service';

@ApiTags('authorizer')
@Controller('authorizer')
export class AuthorizerController {
  constructor(private readonly authorizerService: AuthorizerService) {}

  @Post('/login')
  async login(@Body() data: LoginRequestDto, @ProcessID() processID: string) {
    return this.authorizerService.login(data, processID);
  }
}
