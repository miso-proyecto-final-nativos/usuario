import { ChildEntity, Column } from "typeorm";
import { UsuarioEntity } from "../usuario/usuario.entity";

@ChildEntity()
export class SocioNegocioEntity extends UsuarioEntity {
  @Column()
  razonSocial: string;

  @Column()
  categoriaSocio: number;
}
