import { Injectable, Req } from '@nestjs/common';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { TramiteService } from 'src/tramite/tramite.service';
import { AreaService } from 'src/area/area.service';
import { OutMovimientoDetailsDto, OutMovimientoDto, OutMovimientosDetailsDto, OutMovimientosDto } from './dto/out-movimiento.dto';
import { FileService } from 'src/file/file.service';
import { GetSeguimientoMovimientoDto } from './dto/get-seguimiento-movimiento.dto';
import { printLog } from 'src/utils/utils';

@Injectable()
export class MovimientoService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    private area: AreaService,
    private tramite: TramiteService,
    private file: FileService,
  ) { }

  private readonly customOut = {
    IdMovimiento: true,
    FechaMovimiento: true,
    Copia: true,
    FirmaDigital: true,
    NombreResponsable: true,
    IdMovimientoPadre: true,
    AreaDestino: {
      select: {
        IdArea: true,
        Descripcion: true,
      },
    },
    AreaOrigen: {
      select: {
        IdArea: true,
        Descripcion: true,
      },
    },
    Tramite: {
      select: {
        IdTramite: true,
        Asunto: true,
      },
    },
    CreadoEl: true,
    CreadoPor: true,
    ModificadoEl: true,
    ModificadoPor: true,
  };

  async create(
    createMovimientoDto: CreateMovimientoDto,
    @Req() request?: Request,
  ): Promise<OutMovimientoDto> {
    try {
      //we validate FKs

      const idAreaOrigenFound = await this.area.findOne(
        createMovimientoDto.IdAreaOrigen,
      );
      if (idAreaOrigenFound.message.msgId === 1) return idAreaOrigenFound;

      const idAreaDestinoFound = await this.area.findOne(
        createMovimientoDto.IdAreaDestino,
      );
      if (idAreaDestinoFound.message.msgId === 1) return idAreaDestinoFound;

      const idTramiteFound = await this.tramite.findOne(createMovimientoDto.IdTramite);
      if (idTramiteFound.message.msgId === 1) return idTramiteFound;

      //we create new register
      const movimiento = await this.prisma.movimiento.create({
        data: {
          ...createMovimientoDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (movimiento) {
        this.message.setMessage(0, 'Movimiento - Registro creado');
        return { message: this.message, registro: movimiento };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async createAll(
    createMovimientoDto: CreateMovimientoDto[],
    @Req() request?: Request,
  ): Promise<OutMovimientoDto> {
    try {

      createMovimientoDto.map((mov) => {
        mov.CreadoPor = `${request?.user?.id ?? 'test user'}`
      })

      const movimiento = await this.prisma.movimiento.createMany({
        data: createMovimientoDto,
      });

      if (movimiento) {
        this.message.setMessage(0, 'Movimiento - Registros creados');
        return { message: this.message };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findAll(combinationsFiltersDto: CombinationsFiltersDto): Promise<OutMovimientosDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const movimientos = await this.prisma.movimiento.findMany({
        where: clausula,
        take: limitRows,
        select: this.customOut,
      });

      if (movimientos) {
        this.message.setMessage(0, 'Movimiento - Registros encontrados');
        return { message: this.message, registro: movimientos };
      } else {
        this.message.setMessage(
          1,
          'Error: Movimiento - Registros no encontrados',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findAllDetails(combinationsFiltersDto: CombinationsFiltersDto): Promise<OutMovimientosDetailsDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const movimientos = await this.prisma.movimiento.findMany({
        where: clausula,
        take: limitRows,
        select: {
          IdMovimiento: true,

          HistorialMovimientoxEstado: {
            select: {
              IdHistorialMxE: true,
              FechaHistorialMxE: true,
              Estado: {
                select: {
                  IdEstado: true,
                  Descripcion: true,
                }
              }
              // Observaciones:true,
              // Detalle:true,
            },
            orderBy: {
              FechaHistorialMxE: 'desc'
            },
            // take:1
          },
          Documento: {
            select: {
              IdDocumento: true,
              CodigoReferenciaDoc: true,
              Asunto: true,
              Folios: true,
              Visible: true,
              TipoDocumento: {
                select: {
                  IdTipoDocumento: true,
                  Descripcion: true,
                }
              },
            },
          },
          AreaOrigen: {
            select: {
              IdArea: true,
              Descripcion: true,
            }
          },
          AreaDestino: {
            select: {
              IdArea: true,
              Descripcion: true,
            }
          },
          Motivo: true,
          Acciones: true,
          FechaMovimiento: true,
          NombreResponsable: true,//destinatario

          // si en el movimiento solo hay documento solo a nivel de tramite, se toma ese - Documento==null -> emitido
          // si en el movimiento hay documento a nivel de tramite y movimiento, se toma el de movimiento 

          Tramite: {
            select: {
              IdTramite: true,
              CodigoReferenciaTram: true,
              Descripcion: true,
              FechaInicio: true,
              FechaFin: true,
              Remitente: {
                select: {
                  IdUsuario: true,
                  Nombres: true,
                  ApellidoPaterno: true,
                  ApellidoMaterno: true,
                  NroIdentificacion: true,
                },
              },
              TipoTramite: {
                select: {
                  IdTipoTramite: true,
                  Descripcion: true,
                },
              },
              Estado: {
                select: {
                  IdEstado: true,
                  Descripcion: true,
                },
              },
              // Documento: {
              //   select: {
              //     IdDocumento: true,
              //     CodigoReferenciaDoc: true,
              //     Asunto: true,
              //     Folios: true,
              //     TipoDocumento: {
              //       select: {
              //         IdTipoDocumento: true,
              //         Descripcion: true,
              //       }
              //     },
              //   },
              // },
            }
          },
        },
      });

      if (movimientos) {
        this.message.setMessage(0, 'Movimiento - Registros encontrados');
        return { message: this.message, registro: movimientos };
      } else {
        this.message.setMessage(
          1,
          'Error: Movimiento - Registros no encontrados',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutMovimientoDto> {
    try {
      const movimiento = await this.prisma.movimiento.findUnique({
        where: { IdMovimiento: id },
        select: this.customOut,
      });

      if (movimiento) {
        this.message.setMessage(0, 'Movimiento - Registro encontrado');
        return { message: this.message, registro: movimiento };
      } else {
        this.message.setMessage(
          1,
          'Error: Movimiento - Registro no encontrado',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOneDetails(id: number): Promise<OutMovimientoDetailsDto> {
    try {
      const movimiento = await this.prisma.movimiento.findUnique({
        where: { IdMovimiento: id },
        select: {
          IdMovimiento: true,

          HistorialMovimientoxEstado: {
            select: {
              IdHistorialMxE: true,
              FechaHistorialMxE: true,
              Estado: {
                select: {
                  IdEstado: true,
                  Descripcion: true,
                }
              }
              // Observaciones:true,
              // Detalle:true,
            },
            orderBy: {
              FechaHistorialMxE: 'desc'
            },
            // take:1
          },
          Documento: {
            select: {
              IdDocumento: true,
              CodigoReferenciaDoc: true,
              Asunto: true,
              Folios: true,
              Visible: true,
              TipoDocumento: {
                select: {
                  IdTipoDocumento: true,
                  Descripcion: true,
                }
              },
            },
          },
          AreaOrigen: {
            select: {
              IdArea: true,
              Descripcion: true,
            }
          },
          AreaDestino: {
            select: {
              IdArea: true,
              Descripcion: true,
            }
          },
          Motivo: true,
          Acciones: true,
          FechaMovimiento: true,
          NombreResponsable: true,//destinatario

          // si en el movimiento solo hay documento solo a nivel de tramite, se toma ese - Documento==null -> emitido
          // si en el movimiento hay documento a nivel de tramite y movimiento, se toma el de movimiento 

          Tramite: {
            select: {
              IdTramite: true,
              CodigoReferenciaTram: true,
              Descripcion: true,
              FechaInicio: true,
              FechaFin: true,
              Remitente: {
                select: {
                  IdUsuario: true,
                  Nombres: true,
                  ApellidoPaterno: true,
                  ApellidoMaterno: true,
                  NroIdentificacion: true,
                },
              },
              TipoTramite: {
                select: {
                  IdTipoTramite: true,
                  Descripcion: true,
                },
              },
              Estado: {
                select: {
                  IdEstado: true,
                  Descripcion: true,
                },
              },
              // Documento: {
              //   select: {
              //     IdDocumento: true,
              //     CodigoReferenciaDoc: true,
              //     Asunto: true,
              //     Folios: true,
              //     TipoDocumento: {
              //       select: {
              //         IdTipoDocumento: true,
              //         Descripcion: true,
              //       }
              //     },
              //   },
              // },
            }
          },
        },
      });

      if (movimiento) {
        this.message.setMessage(0, 'Movimiento - Registro encontrado');
        return { message: this.message, registro: movimiento };
      } else {
        this.message.setMessage(
          1,
          'Error: Movimiento - Registro no encontrado',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  // async findOneSeguimiento(id: number): Promise<OutMovimientoDetailsDto> {
  async findOneSeguimiento(getSeguimientoMovimientoDto: GetSeguimientoMovimientoDto): Promise<any> {
    try {
      type MovimientoNode = {
        Documento: {
          CreadoEl: Date
          IdDocumento: number
          Folios: number
          Asunto: string
          CodigoReferenciaDoc: string
          Visible: boolean
          TipoDocumento: {
            Descripcion: string
            IdTipoDocumento: number
          }
        }
        AreaOrigen: {
          IdArea: number,
          Descripcion: string,
        },
        AreaDestino: {
          IdArea: number,
          Descripcion: string,
        },
        IdMovimiento: number
        FechaMovimiento: Date
        IdMovimientoPadre: number
        NombreResponsable: string
        Acciones: string
        Motivo: string
        FirmaDigital: boolean,
        Copia: boolean,
        HistorialMovimientoxEstado: {
          Estado: {
            Descripcion: string
            IdEstado: number
          };
          IdHistorialMxE: number
          FechaHistorialMxE: Date,
          Observaciones: string,
          Detalle: string,
        }[],
        Children: MovimientoNode[]
      }

      const tramite = await this.prisma.tramite.findUnique({
        where: { IdTramite: getSeguimientoMovimientoDto.IdTramite },
        select: {
          IdTramite: true,
          Area: {
            select: {
              IdArea: true,
              Descripcion: true,
            }
          },
          FechaInicio: true,
          Remitente: {
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
              NroIdentificacion: true,
              Email: true
            },
          },
          // CodigoReferenciaTram: true,
          // Descripcion: true,
          // FechaInicio: true,
          // FechaFin: true,
          // Remitente: {
          //   select: {
          //     IdUsuario: true,
          //     Nombres: true,
          //     ApellidoPaterno: true,
          //     ApellidoMaterno: true,
          //     NroIdentificacion: true,
          //   },
          // },
          TipoTramite: {
            select: {
              IdTipoTramite: true,
              Descripcion: true,
            },
          },
          // Estado: {
          //   select: {
          //     IdEstado: true,
          //     Descripcion: true,
          //   },
          // },
          Movimiento: {
            select: {
              IdMovimiento: true,
              IdMovimientoPadre: true,
              HistorialMovimientoxEstado: {
                select: {
                  IdHistorialMxE: true,
                  FechaHistorialMxE: true,
                  Estado: {
                    select: {
                      IdEstado: true,
                      Descripcion: true,
                    }
                  },
                  Observaciones: true,
                  Detalle: true,
                },
                orderBy: {
                  FechaHistorialMxE: 'desc'
                },
                // take:1
              },
              Documento: {
                select: {
                  IdDocumento: true,
                  UrlDocumento: true,
                  CreadoEl: true,
                  CodigoReferenciaDoc: true,
                  Asunto: true,
                  Folios: true,
                  Visible: true,
                  TipoDocumento: {
                    select: {
                      IdTipoDocumento: true,
                      Descripcion: true,
                    }
                  },
                  Anexo: {
                    select: {
                      IdAnexo: true,
                    },
                  },
                },
              },
              AreaOrigen: {
                select: {
                  IdArea: true,
                  Descripcion: true,
                }
              },
              AreaDestino: {
                select: {
                  IdArea: true,
                  Descripcion: true,
                }
              },
              Motivo: true,
              Acciones: true,
              FechaMovimiento: true,
              NombreResponsable: true,
              FirmaDigital: true,
              Copia: true,
            },
            orderBy: {
              FechaMovimiento: 'asc'
            },
          }
        },
      });

      if (tramite) {
        const mapMovimientoNode = new Map<number, MovimientoNode>();

        const rootsMovimientoNode: MovimientoNode[] = [];

        // Inicializamos todos los movimientos en el mapa
        tramite.Movimiento.forEach(mov => {
          mapMovimientoNode.set(mov.IdMovimiento, { ...mov, Children: [] });
        });

        // Construimos el árbol con relaciones
        tramite.Movimiento.forEach(mov => {
          if (mov.IdMovimientoPadre === null) {
            // Raíz
            rootsMovimientoNode.push(mapMovimientoNode.get(mov.IdMovimiento)!);
          } else {
            const parent = mapMovimientoNode.get(mov.IdMovimientoPadre);
            if (parent) {
              parent.Children.push(mapMovimientoNode.get(mov.IdMovimiento)!);
            }
          }
        });

        const documentos = tramite.Movimiento
          .filter((movimiento) => movimiento.Documento?.IdDocumento != null)
          .sort((a, b) => new Date(b.Documento.CreadoEl).getTime() - new Date(a.Documento.CreadoEl).getTime())
          .map((movimiento) => {
            return {
              Documento: movimiento.Documento,
              FirmaDigital: movimiento.FirmaDigital,
              Copia: movimiento.Copia,
              Anexos: movimiento.Documento?.Anexo.length || 0
            }
          });

        const movimiento = tramite.Movimiento.find((movimiento) => movimiento.IdMovimiento == getSeguimientoMovimientoDto.IdMovimiento);


        this.message.setMessage(0, 'Movimiento - Registro encontrado');

        return {
          message: this.message, registro: {
            Tramite: tramite,
            Movimiento: {
              IdMomiento: movimiento?.IdMovimiento,
              Asunto: movimiento.Documento?.Asunto || '',
            },
            Seguimiento: rootsMovimientoNode,
            Documentos: documentos
          }
        };
      } else {
        this.message.setMessage(
          1,
          'Error: Movimiento - Registro no encontrado',
        );
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async update(
    id: number,
    updateMovimientoDto: UpdateMovimientoDto,
    @Req() request?: Request,
  ): Promise<OutMovimientoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const idAreaOrigen = updateMovimientoDto.IdAreaOrigen;
      if (idAreaOrigen) {
        const idAreaOrigenFound = await this.area.findOne(idAreaOrigen);
        if (idAreaOrigenFound.message.msgId === 1) return idAreaOrigenFound;
      }

      const idAreaDestino = updateMovimientoDto.IdAreaDestino;
      if (idAreaDestino) {
        const idAreaDestinoFound = await this.area.findOne(idAreaDestino);
        if (idAreaDestinoFound.message.msgId === 1) return idAreaDestinoFound;
      }

      const idTramite = updateMovimientoDto.IdTramite;
      if (idTramite) {
        const idTramiteFound = await this.tramite.findOne(idTramite);
        if (idTramiteFound.message.msgId === 1) return idTramiteFound;
      }

      const movimiento = await this.prisma.movimiento.update({
        where: { IdMovimiento: id },
        data: {
          ...updateMovimientoDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (movimiento) {
        this.message.setMessage(0, 'Movimiento - Registro actualizado');
        return { message: this.message, registro: movimiento };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }
  async remove(id: number): Promise<OutMovimientoDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const movimiento = await this.prisma.movimiento.delete({
        where: { IdMovimiento: id },
      });

      if (movimiento) {
        this.message.setMessage(0, 'Movimiento - Registro eliminado');
        return { message: this.message, registro: movimiento };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // this code in prisma P2003 verifies referential integrity of FK and PK, we return custom message
        if (error.code === 'P2003') {
          this.message.setMessage(
            1,
            'Oops! No se puede eliminar este registro porque está relacionado con otros datos.',
          );
        }
      } else {
        // whatever other error, we return the error message
        this.message.setMessage(1, error.message);
      }
      console.log(error);
      return { message: this.message };
    }
  }

  async removeDetails(id: number): Promise<OutMovimientoDto> {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {

        const movimiento = await prisma.movimiento.findUnique({
          where: { IdMovimiento: id },
          select: {
            IdMovimiento: true,
            IdMovimientoPadre: true,
            HistorialMovimientoxEstado: {
              select: {
                IdHistorialMxE: true,
                FechaHistorialMxE: true,
                IdDocumento: true,
                Estado: {
                  select: {
                    IdEstado: true,
                    Descripcion: true,
                  }
                }
              },
              orderBy: {
                FechaHistorialMxE: 'desc'
              },
              take: 1
            },
            Documento: {
              select: {
                IdDocumento: true,
                Anexo: {
                  select: {
                    IdAnexo: true,
                    UrlAnexo: true
                  }
                }
              }
            }
          }
        });

        if (!(movimiento && movimiento?.IdMovimiento)) {
          throw Error('Error: Movimiento - Registro no encontrado')
        }

        // if Estado is 15 (Pendiente) we can remove this movimiento
        if (!(movimiento.HistorialMovimientoxEstado[0].Estado.IdEstado == 15)) {
          throw Error('Error: Movimiento ya ha sido recibido, no podemos cancelar derivación')
        }

        if (movimiento.Documento?.IdDocumento) {
          //we delete HistorialMovimientoxEstado in db
          const HxE = await prisma.historialMovimientoxEstado.deleteMany({
            where: {
              IdMovimiento: id,
              // IdEstado: 17, // IdEstado - Derivado - 17
            },
          });

          if (HxE.count != movimiento.HistorialMovimientoxEstado.length) {
            throw Error('Error al eliminar el Historia lMovimiento x Estado');
          }

          //we delete movimiento in db
          const movimientoDelete = await prisma.movimiento.delete({
            where: {
              IdMovimiento: id
            },
            select: {
              IdMovimiento: true
            }
          });

          if (!movimientoDelete) {
            throw Error('Error al eliminar el movimiento');
          }

          // we delete anexos in db
          if (movimiento.Documento.Anexo.length > 0) {
            const anexos = await prisma.anexo.deleteMany({
              where: {
                IdDocumento: movimiento.Documento.IdDocumento
              },
            })

            if (anexos.count != movimiento.Documento.Anexo.length) {
              throw Error('Error al eliminar anexos');
            }
          }

          //we delete documento in db
          const documentoDelete = await prisma.documento.delete({
            where: {
              IdDocumento: movimiento.Documento.IdDocumento
            },
            select: {
              IdDocumento: true,
              UrlDocumento: true
            }
          });

          if (!documentoDelete) {
            throw Error('Error al eliminar el documento');
          }

          //we delete HistorialMovimientoxEstado of Movimineto padre If it doesnt has other movimientos 
          if (movimiento.IdMovimientoPadre) {
            const movimientoPadre = await prisma.movimiento.findUnique({
              where: {
                IdMovimiento: movimiento.IdMovimientoPadre
              },
              select: {
                IdMovimiento: true,
                HistorialMovimientoxEstado: {
                  select: {
                    IdHistorialMxE: true,
                    FechaHistorialMxE: true,
                  },
                  orderBy: {
                    FechaHistorialMxE: 'desc'
                  },
                  take: 1
                },
                other_Movimiento: {
                  select: {
                    IdMovimiento: true
                  }
                }
              }
            })

            if (movimientoPadre?.other_Movimiento.length == 0) {
              const HxE = await prisma.historialMovimientoxEstado.deleteMany({
                where: {
                  IdMovimiento: movimientoPadre.IdMovimiento,
                  IdEstado: 17, // IdEstado - Derivado - 17
                },
              });

              if (HxE.count != movimientoPadre.HistorialMovimientoxEstado.length) {
                throw Error('Error al eliminar el Historia lMovimiento x Estado');
              }
            }
          }

          // we delete phisical files of anexos and documentos bu Url
          if (movimiento.Documento.Anexo.length > 0) {
            movimiento.Documento.Anexo.map(async (anexo) => {
              await this.file.remove({ PublicUrl: anexo.UrlAnexo });
            })
          }

          await this.file.remove({ PublicUrl: documentoDelete.UrlDocumento });

          return { movimientoDelete: movimientoDelete }
        } else {
          //we delete HistorialMovimientoxEstado in db
          const HxE = await prisma.historialMovimientoxEstado.deleteMany({
            where: {
              IdMovimiento: id,
              // IdEstado: 17, // IdEstado - Derivado - 17
            },
          });

          if (HxE.count != movimiento.HistorialMovimientoxEstado.length) {
            throw Error('Error al eliminar el Historia lMovimiento x Estado');
          }

          //we delete movimiento in db
          const movimientoDelete = await prisma.movimiento.delete({
            where: {
              IdMovimiento: id
            },
            select: {
              IdMovimiento: true
            }
          });

          if (!movimientoDelete) {
            throw Error('Error al eliminar el movimiento');
          }

          //we delete HistorialMovimientoxEstado of Movimineto padre If it doesnt has other movimientos 
          if (movimiento.IdMovimientoPadre) {
            const movimientoPadre = await prisma.movimiento.findUnique({
              where: {
                IdMovimiento: movimiento.IdMovimientoPadre
              },
              select: {
                IdMovimiento: true,
                HistorialMovimientoxEstado: {
                  select: {
                    IdHistorialMxE: true,
                    FechaHistorialMxE: true,
                  },
                  orderBy: {
                    FechaHistorialMxE: 'desc'
                  },
                  take: 1
                },
                other_Movimiento: {
                  select: {
                    IdMovimiento: true
                  }
                }
              }
            })

            if (movimientoPadre?.other_Movimiento.length == 0) {
              const HxE = await prisma.historialMovimientoxEstado.deleteMany({
                where: {
                  IdMovimiento: movimientoPadre.IdMovimiento,
                  IdEstado: 17, // IdEstado - Derivado - 17
                },
              });

              if (HxE.count != movimientoPadre.HistorialMovimientoxEstado.length) {
                throw Error('Error al eliminar el Historia lMovimiento x Estado');
              }
            }
          }

          return { movimientoDelete: movimientoDelete }
        }
      })

      if (result.movimientoDelete.IdMovimiento) {
        this.message.setMessage(0, 'Movimiento - Registro eliminado');
        return { message: this.message, registro: result.movimientoDelete };
      } else {
        this.message.setMessage(1, 'Error: Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // this code in prisma P2003 verifies referential integrity of FK and PK, we return custom message
        if (error.code === 'P2003') {
          this.message.setMessage(
            1,
            'Oops! No se puede eliminar este registro porque está relacionado con otros datos.',
          );
        }
      } else {
        // whatever other error, we return the error message
        this.message.setMessage(1, error.message);
      }
      console.log(error);
      return { message: this.message };
    }
  }
}
