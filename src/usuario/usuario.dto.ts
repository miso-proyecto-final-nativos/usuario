import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class UsuarioDto {
  @IsString()
  @IsNotEmpty()
  readonly nombres: string;

  @IsString()
  @IsNotEmpty()
  readonly apellidos: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @Min(8)
  readonly password: string;

  @IsOptional()
  roles: string[];
}
