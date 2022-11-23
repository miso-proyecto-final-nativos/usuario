import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuarioEntity } from "../../usuario/usuario.entity";
import { SocioNegocioEntity } from "../../socios-negocio/socio-negocio.entity";

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [SocioNegocioEntity, UsuarioEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([SocioNegocioEntity, UsuarioEntity]),
];
