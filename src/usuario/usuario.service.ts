import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async createUsuarioEntity(UsuarioEntity: any): Promise<InsertResult> {
    try {
      /**
       * Perform all needed checks
       */

      const usuarioEntity = this.usuarioEntityRepository.create(UsuarioEntity);

      const res = await this.usuarioEntityRepository.insert(usuarioEntity);

      Logger.log('createUsuarioEntity - Created UsuarioEntity');

      return res;
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }
}
