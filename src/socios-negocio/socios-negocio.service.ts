import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  BusinessError,
  BusinessLogicException,
} from "../shared/errors/business-errors";
import { FindOneOptions, Repository } from "typeorm";
import { SocioNegocioEntity } from "./socio-negocio.entity";

@Injectable()
export class SociosNegocioService {
  constructor(
    @InjectRepository(SocioNegocioEntity)
    private readonly socioNegocioRepository: Repository<SocioNegocioEntity>
  ) {}

  async findAll(): Promise<SocioNegocioEntity[]> {
    return await this.socioNegocioRepository.find();
  }

  async findOne(id: number): Promise<SocioNegocioEntity> {
    return await this.validarSocioNegocio(id);
  }

  async findOneWithQuery(
    query: FindOneOptions<SocioNegocioEntity>
  ): Promise<SocioNegocioEntity> {
    return await this.socioNegocioRepository.findOne(query);
  }

  private async validarSocioNegocio(id: number) {
    const socioNegocio: SocioNegocioEntity =
      await this.socioNegocioRepository.findOne({ where: { id } });
    if (!socioNegocio)
      throw new BusinessLogicException(
        "No se encontró el socio de negocio con el id suministrado",
        BusinessError.NOT_FOUND
      );
    return socioNegocio;
  }

  async create(socioNegocio: SocioNegocioEntity): Promise<SocioNegocioEntity> {
    try {
      return await this.socioNegocioRepository.save(socioNegocio);
    } catch (error) {
      Logger.log(error);
      if (
        error.message.includes("duplicate key value violates unique constraint")
      ) {
        throw new BusinessLogicException(
          "El correo electrónico ingresado ya se encuentra registrado",
          BusinessError.PRECONDITION_FAILED
        );
      } else {
        throw error;
      }
    }
  }

  async update(
    id: number,
    socioNegocio: SocioNegocioEntity
  ): Promise<SocioNegocioEntity> {
    const socioNegocioPersisted: SocioNegocioEntity =
      await this.validarSocioNegocio(id);
    return await this.socioNegocioRepository.save({
      ...socioNegocioPersisted,
      ...socioNegocio,
    });
  }

  async delete(id: number) {
    const socioNegocioPersisted: SocioNegocioEntity =
      await this.validarSocioNegocio(id);
    await this.socioNegocioRepository.remove(socioNegocioPersisted);
  }
}
