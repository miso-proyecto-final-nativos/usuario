import { Module } from "@nestjs/common";
import { UsuarioService } from "./usuario.service";
import { UsuarioController } from "./usuario.controller";
import { UsuarioEntity } from "./usuario.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { configuration } from "src/config/configuration";
import { SociosNegocioService } from "src/socios-negocio/socios-negocio.service";
import { SocioNegocioEntity } from "src/socios-negocio/socio-negocio.entity";
import { TerminusModule } from "@nestjs/terminus";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${
        process.env.NODE_ENV
      }.env`,
      load: [configuration],
    }),
    TypeOrmModule.forFeature([UsuarioEntity, SocioNegocioEntity]),
    ClientsModule.registerAsync([
      {
        name: "AUTH_CLIENT",
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>("auth_microservice.host"),
            port: configService.get<number>("auth_microservice.port"),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    TerminusModule,
  ],
  providers: [UsuarioService, SociosNegocioService],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
