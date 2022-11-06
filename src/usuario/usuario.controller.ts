import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly userService: UsuarioService) {}

  @MessagePattern({ role: 'user', cmd: 'get' })
  async getUser(data: any): Promise<UsuarioEntity> {
    return await this.userService.findOne({
      where: { email: data.username },
    });
  }

  @MessagePattern({ role: 'user', cmd: 'getById' })
  async findById(data: any): Promise<UsuarioEntity> {
    return await this.userService.findOne({
      where: { id: data.idDeportista },
    });
  }

  @UseGuards(AuthGuard)
  @Get('greet')
  async greet(): Promise<string> {
    return 'Greetings authenticated user';
  }

  @Post()
  async create(@Body() usuario: UsuarioEntity) {
    return await this.userService.createUsuarioEntity(usuario);
  }

  @Get('health')
  async healthCheck(): Promise<string> {
    return 'All good!';
  }
}
