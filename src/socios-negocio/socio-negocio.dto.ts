import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class SocioNegocioDto {
  @IsString()
  @IsNotEmpty()
  readonly razonSocial: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNumber()
  readonly categoriaSocio: number;

  @IsNotEmpty()
  @Min(8)
  readonly password: string;
}
