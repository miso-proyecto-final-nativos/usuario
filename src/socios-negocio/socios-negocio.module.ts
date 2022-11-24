import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configuration } from "src/config/configuration";
import { SocioNegocioEntity } from "./socio-negocio.entity";
import { SociosNegocioController } from "./socios-negocio.controller";
import { SociosNegocioService } from "./socios-negocio.service";
import { TerminusModule } from "@nestjs/terminus";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${
        process.env.NODE_ENV
      }.env`,
      load: [configuration],
    }),
    TypeOrmModule.forFeature([SocioNegocioEntity]),
    TerminusModule,
  ],
  providers: [
    {
      provide: "MS_CATALOGO_SERVICE",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>("catalogo_microservice.host"),
            port: configService.get<number>("catalogo_microservice.port"),
          },
        }),
    },
    {
      provide: "AUTH_CLIENT",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>("auth_microservice.host"),
            port: configService.get<number>("auth_microservice.port"),
          },
        }),
    },
    SociosNegocioService,
  ],
  controllers: [SociosNegocioController],
})
export class SociosNegocioModule {}
