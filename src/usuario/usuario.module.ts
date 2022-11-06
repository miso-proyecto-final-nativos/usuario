import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioEntity } from './usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from 'src/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${
        process.env.NODE_ENV
      }.env`,
      load: [configuration],
    }),
    TypeOrmModule.forFeature([UsuarioEntity]),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('auth_microservice.host'),
            port: configService.get<number>('auth_microservice.port'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
