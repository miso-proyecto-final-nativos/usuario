import { hash } from "bcrypt";
import { IsEmail, Min } from "class-validator";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from "typeorm";
import { UserInterface } from "./user.interface";
import { Exclude } from "class-transformer";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class UsuarioEntity implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "" })
  nombres: string;

  @Column({ default: "" })
  apellidos: string;

  @Column()
  @Min(8)
  @Exclude()
  password: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @CreateDateColumn()
  createdAt?: Date;

  @BeforeInsert()
  async hashPassword?() {
    this.password = await hash(this.password, 10);
  }
}
