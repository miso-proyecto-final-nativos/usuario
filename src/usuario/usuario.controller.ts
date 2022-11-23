import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { BusinessErrorsInterceptor } from "src/shared/interceptors/business-errors.interceptor";
import { AuthGuard } from "./guards/auth.guard";
import { UsuarioEntity } from "./usuario.entity";
import { UsuarioService } from "./usuario.service";
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";

@UseInterceptors(BusinessErrorsInterceptor)
@Controller("usuario")
export class UsuarioController {
  constructor(
    private readonly userService: UsuarioService,
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get("health")
  @HealthCheck()
  async healthCheck() {
    return this.health.check([async () => this.db.pingCheck("database")]);
  }

  @MessagePattern({ role: "user", cmd: "get" })
  async getUser(data: any): Promise<UsuarioEntity> {
    return await this.userService.findOne({
      where: { email: data.username },
    });
  }

  @MessagePattern({ role: "user", cmd: "getById" })
  async findById(data: any): Promise<UsuarioEntity> {
    return await this.userService.findOne({
      where: { id: data.idDeportista },
    });
  }

  @UseGuards(AuthGuard)
  @Get("greet")
  async greet(): Promise<string> {
    return "Greetings authenticated user";
  }

  @Post()
  async create(@Body() usuario: UsuarioEntity) {
    return await this.userService.createUsuarioEntity(usuario);
  }
}
