import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  RequestTimeoutException,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";
import { plainToInstance } from "class-transformer";
import {
  catchError,
  firstValueFrom,
  throwError,
  timeout,
  TimeoutError,
} from "rxjs";
import {
  BusinessError,
  BusinessLogicException,
} from "src/shared/errors/business-errors";
import { BusinessErrorsInterceptor } from "src/shared/interceptors/business-errors.interceptor";
import { AuthGuard } from "../usuario/guards/auth.guard";
import { SocioNegocioDto } from "./socio-negocio.dto";
import { SocioNegocioEntity } from "./socio-negocio.entity";
import { SociosNegocioService } from "./socios-negocio.service";

@UseInterceptors(BusinessErrorsInterceptor, ClassSerializerInterceptor)
@Controller("socios-negocio")
export class SociosNegocioController {
  constructor(
    @Inject("MS_CATALOGO_SERVICE") private clienteCatalogoService: ClientProxy,
    private readonly socioNegocioService: SociosNegocioService,
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get("health")
  @HealthCheck()
  async healthCheck() {
    return this.health.check([async () => this.db.pingCheck("database")]);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.socioNegocioService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  async findOne(@Param("id") id: number) {
    return await this.socioNegocioService.findOne(id);
  }

  @Post()
  async create(@Body() socioNegocioDto: SocioNegocioDto) {
    await this.validarCategoriaSocio(socioNegocioDto.categoriaSocio);
    const socioNegocio: SocioNegocioEntity = plainToInstance(
      SocioNegocioEntity,
      socioNegocioDto
    );
    return await this.socioNegocioService.create(socioNegocio);
  }

  private async validarCategoriaSocio(categoriaSocioId: number) {
    const categoriaSocio$ = this.clienteCatalogoService
      .send({ role: "categoriaSocio", cmd: "getById" }, { categoriaSocioId })
      .pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(() => err);
        })
      );

    const categoriaSocio = await firstValueFrom(categoriaSocio$);

    if (!categoriaSocio) {
      throw new BusinessLogicException(
        `No se encontró un categoría de socio con el id ${categoriaSocioId}`,
        BusinessError.NOT_FOUND
      );
    }
  }

  @UseGuards(AuthGuard)
  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() socioNegocioDto: SocioNegocioDto
  ) {
    await this.validarCategoriaSocio(socioNegocioDto.categoriaSocio);
    const socioNegocio: SocioNegocioEntity = plainToInstance(
      SocioNegocioEntity,
      socioNegocioDto
    );
    return await this.socioNegocioService.update(id, socioNegocio);
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id") id: number) {
    return await this.socioNegocioService.delete(id);
  }
}
