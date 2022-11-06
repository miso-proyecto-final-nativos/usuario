import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthGuard } from './guards/auth.guard';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller("usuario")
export class UsuarioController {
  constructor(private readonly userService: UsuarioService) { }

  @MessagePattern({ role: 'user', cmd: 'get' })
  async getUser(data: any): Promise<UsuarioEntity> {
    return await this.userService.findOne({
      where: { username: data.username },
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

  @Get("health")
  async healthCheck(): Promise<string> {
    return 'All good!';
  }

}
