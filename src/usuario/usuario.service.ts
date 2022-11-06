import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { FindOneOptions, InsertResult, Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioEntityRepository: Repository<UsuarioEntity>,
  ) {}

  async findOne(query: FindOneOptions<UsuarioEntity>): Promise<UsuarioEntity> {
    return await this.usuarioEntityRepository.findOne(query);
  }

  async createUsuarioEntity(usuario: UsuarioEntity): Promise<InsertResult> {
    try {
      /**
       * Perform all needed checks
       */

      const usuarioEntity = this.usuarioEntityRepository.create(usuario);

      const res = await this.usuarioEntityRepository.insert(usuarioEntity);

      Logger.log('createUsuarioEntity - Created UsuarioEntity');

      return res;
    } catch (e) {
      Logger.log(e);
      if (
        e.message.includes('duplicate key value violates unique constraint')
      ) {
        throw new BusinessLogicException(
          'El correo electrónico ingresado ya se encuentra registrado',
          BusinessError.PRECONDITION_FAILED,
        );
      } else {
        throw e;
      }
    }
  }
}
