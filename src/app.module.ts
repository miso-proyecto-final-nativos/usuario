import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configuration } from "./config/configuration";
import { UsuarioModule } from "./usuario/usuario.module";
import { AppService } from "./app.service";
import { UsuarioEntity } from "./usuario/usuario.entity";
import { SociosNegocioModule } from "./socios-negocio/socios-negocio.module";
import { SocioNegocioEntity } from "./socios-negocio/socio-negocio.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${
        process.env.NODE_ENV
      }.env`,
      load: [configuration],
    }),
    UsuarioModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("database.host"),
        database: configService.get<string>("database.dbName"),
        port: configService.get<number>("database.port"),
        username: configService.get<string>("database.user"),
        password: configService.get<string>("database.password"),
        synchronize: true,
        entities: [UsuarioEntity, SocioNegocioEntity],
      }),
      inject: [ConfigService],
    }),
    SociosNegocioModule,
  ],
  providers: [AppService],
})
export class AppModule {}
