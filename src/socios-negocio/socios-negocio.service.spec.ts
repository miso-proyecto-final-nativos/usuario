import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { Repository } from "typeorm";
import { SociosNegocioService } from "./socios-negocio.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { faker } from "@faker-js/faker";
import { SocioNegocioEntity } from "./socio-negocio.entity";
import { Role } from "../usuario/roles/role.enum";

describe("SociosNegocioService", () => {
  let service: SociosNegocioService;
  let repository: Repository<SocioNegocioEntity>;
  let sociosNegocioList: SocioNegocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SociosNegocioService],
    }).compile();

    service = module.get<SociosNegocioService>(SociosNegocioService);
    repository = module.get<Repository<SocioNegocioEntity>>(
      getRepositoryToken(SocioNegocioEntity)
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    sociosNegocioList = [];
    const rol: Role[] = [Role.SocioNegocio];
    for (let i = 0; i < 5; i++) {
      const socioNegocio: SocioNegocioEntity = await repository.save({
        razonSocial: faker.company.name(),
        email: faker.internet.email(),
        categoriaSocio: faker.datatype.number(100),
        password: faker.random.alphaNumeric(8),
        nombres: "",
        apellidos: "",
        roles: rol.toString(),
      });
      sociosNegocioList.push(socioNegocio);
    }
  };

  it("El servicio debe estar definido.", () => {
    expect(service).toBeDefined();
  });

  it("findAll debe retornar todos los socios de negocio", async () => {
    const sociosNegocio: SocioNegocioEntity[] = await service.findAll();
    expect(sociosNegocio).not.toBeNull();
    expect(sociosNegocio).toHaveLength(sociosNegocioList.length);
  });

  it("findOne debe retornar un socio de negocio a partir de un id", async () => {
    const socioNegocioAlmacenado: SocioNegocioEntity = sociosNegocioList[0];
    const socioNegocio: SocioNegocioEntity = await service.findOne(
      socioNegocioAlmacenado.id
    );
    expect(socioNegocio).not.toBeNull();
    expect(socioNegocio.razonSocial).toEqual(
      socioNegocioAlmacenado.razonSocial
    );
    expect(socioNegocio.email).toEqual(socioNegocioAlmacenado.email);
    expect(socioNegocio.categoriaSocio).toEqual(
      socioNegocioAlmacenado.categoriaSocio
    );
    expect(socioNegocio.roles).toEqual(socioNegocioAlmacenado.roles);
  });

  it("findOne debe lanzar una excepción para un id de socio de negocio no válido", async () => {
    await expect(() => service.findOne(-1)).rejects.toHaveProperty(
      "message",
      "No se encontró el socio de negocio con el id suministrado"
    );
  });

  it("create debe crear un nuevo socio de negocio", async () => {
    const rol: Role[] = [Role.Deportista];
    const socioNegocio: SocioNegocioEntity = {
      id: -1,
      razonSocial: faker.company.name(),
      email: faker.internet.email(),
      categoriaSocio: faker.datatype.number(100),
      password: faker.random.alphaNumeric(8),
      nombres: "",
      apellidos: "",
      roles: rol.toString(),
    };

    const socioNegocioNuevo: SocioNegocioEntity = await service.create(
      socioNegocio
    );
    expect(socioNegocioNuevo).not.toBeNull();

    const socioNegocioAlmacenado: SocioNegocioEntity = await repository.findOne(
      {
        where: { id: socioNegocioNuevo.id },
      }
    );
    expect(socioNegocioAlmacenado).not.toBeNull();
    expect(socioNegocioAlmacenado.razonSocial).toEqual(
      socioNegocioNuevo.razonSocial
    );
    expect(socioNegocioAlmacenado.email).toEqual(socioNegocioNuevo.email);
    expect(socioNegocioAlmacenado.categoriaSocio).toEqual(
      socioNegocioNuevo.categoriaSocio
    );
    expect(socioNegocioAlmacenado.roles).toEqual(socioNegocioNuevo.roles);
  });

  it("update debe modificar un socio de negocio", async () => {
    const socioNegocio: SocioNegocioEntity = sociosNegocioList[0];
    socioNegocio.razonSocial = "Razón social nueva";
    socioNegocio.email = "email@domain.com";
    const socioNegocioActualizado: SocioNegocioEntity = await service.update(
      socioNegocio.id,
      socioNegocio
    );
    expect(socioNegocioActualizado).not.toBeNull();
    const socioNegocioAlmacenado: SocioNegocioEntity = await repository.findOne(
      {
        where: { id: socioNegocio.id },
      }
    );
    expect(socioNegocioAlmacenado).not.toBeNull();
    expect(socioNegocioAlmacenado.razonSocial).toEqual(
      socioNegocio.razonSocial
    );
    expect(socioNegocioAlmacenado.email).toEqual(socioNegocio.email);
  });

  it("update debe lanzar una excepción para un socio de negocio con un id no válido", async () => {
    let socioNegocio: SocioNegocioEntity = sociosNegocioList[0];
    socioNegocio = {
      ...socioNegocio,
      razonSocial: "New name",
      email: "New email",
    };
    await expect(() => service.update(-1, socioNegocio)).rejects.toHaveProperty(
      "message",
      "No se encontró el socio de negocio con el id suministrado"
    );
  });

  it("delete debe eliminar un socio de negocio", async () => {
    const socioNegocio: SocioNegocioEntity = sociosNegocioList[0];
    await service.delete(socioNegocio.id);
    const socioNegocioEliminado: SocioNegocioEntity = await repository.findOne({
      where: { id: socioNegocio.id },
    });
    expect(socioNegocioEliminado).toBeNull();
  });

  it("delete debe lanzar una excepción para un socio de negocio con un id no válido", async () => {
    await expect(() => service.delete(-1)).rejects.toHaveProperty(
      "message",
      "No se encontró el socio de negocio con el id suministrado"
    );
  });
});
