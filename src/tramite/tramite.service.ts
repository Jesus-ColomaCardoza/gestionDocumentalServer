import { Injectable, Req } from '@nestjs/common';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { Menssage } from 'src/menssage/menssage.entity';
import { PrismaService } from 'src/connection/prisma.service';
import { FiltersService } from 'src/filters/filters.service';
import { Request } from 'express';
import { Prisma, Tramite } from '@prisma/client';
import { TipoTramiteService } from 'src/tipo-tramite/tipo-tramite.service';
import { EstadoService } from 'src/estado/estado.service';
import { CombinationsFiltersDto } from 'src/filters/dto/combinations-filters.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { OutTramiteDto, OutTramiteEmitidoDto, OutTramitesDto, OutTramitesPendienteDto } from './dto/out-tramite.dto';
import { OutTipoTramitesDto } from 'src/tipo-tramite/dto/out-tipo-tramite.dto';
import { CreateTramiteEmitidoDto } from './dto/create-tramite-emitido.dto';
import { FileManager } from 'src/file-manager/entities/file-manager.entity';
import { Movimiento } from 'src/movimiento/entities/movimiento.entity';
import { Anexo } from 'src/anexo/entities/anexo.entity';
import { printLog } from 'src/utils/utils';
import { CreateMovimientoDto } from 'src/movimiento/dto/create-movimiento.dto';
import { FileService } from 'src/file/file.service';
import { CreateAnexoDto } from 'src/anexo/dto/create-anexo.dto';
import { TipoDocumentoService } from 'src/tipo-documento/tipo-documento.service';
import { AreaService } from 'src/area/area.service';
import { GetAllTramitePendienteDto } from './dto/get-all-tramite-pediente.dto';

@Injectable()
export class TramiteService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private filtersService: FiltersService,
    private file: FileService,
    private tipoTramite: TipoTramiteService,
    private tipoDocumento: TipoDocumentoService,
    private estado: EstadoService,
    private area: AreaService,
    private remitente: UsuarioService,
  ) { }

  private readonly customOut = {
    IdTramite: true,
    CodigoReferencia: true,
    Asunto: true,
    Descripcion: true,
    Observaciones: true,
    FechaInicio: true,
    FechaFin: true,
    Folios: true,
    Remitente: {
      select: {
        IdUsuario: true,
        Nombres: true,
        ApellidoPaterno: true,
        ApellidoMaterno: true,
      },
    },
    TipoTramite: {
      select: {
        IdTipoTramite: true,
        Descripcion: true,
      },
    },
    TipoDocumento: {
      select: {
        IdTipoDocumento: true,
        Descripcion: true,
      },
    },
    Area: {
      select: {
        IdArea: true,
        Descripcion: true,
      },
    },
    Estado: {
      select: {
        IdEstado: true,
        Descripcion: true,
        EsquemaEstado: {
          select: {
            IdEsquemaEstado: true,
            Descripcion: true,
          },
        },
      },
    },
    Activo: true,
    CreadoEl: true,
    CreadoPor: true,
    ModificadoEl: true,
    ModificadoPor: true,
    Anexo: {
      select: {
        IdAnexo: true,
        NombreAnexo: true,
        UrlAnexo: true,
      }
    },
    Documento: {
      select: {
        IdDocumento: true,
        NombreDocumento: true,
        UrlDocumento: true,
      },
    },
    Movimiento: {
      select: {
        IdMovimiento: true,
        AreaDestino: {
          select: {
            Descripcion: true,
          }
        }
      },
    }
  };

  async create(
    createTramiteDto: CreateTramiteDto,
    @Req() request?: Request,
  ): Promise<OutTramiteDto> {
    try {
      //we validate FKs

      const idTipoTramiteFound = await this.tipoTramite.findOne(
        createTramiteDto.IdTipoTramite,
      );
      if (idTipoTramiteFound.message.msgId === 1) return idTipoTramiteFound;

      const idEstadoFound = await this.estado.findOne(
        createTramiteDto.IdEstado,
      );
      if (idEstadoFound.message.msgId === 1) return idEstadoFound;

      const idRemitenteFound = await this.remitente.findOne(
        createTramiteDto.IdRemitente,
      );
      if (idRemitenteFound.message.msgId === 1) return idRemitenteFound;

      //we create new register
      const tramite = await this.prisma.tramite.create({
        data: {
          ...createTramiteDto,
          CreadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (tramite) {
        this.message.setMessage(0, 'Trámite - Registro creado');
        return { message: this.message, registro: tramite };
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

  async createEmitido(
    createTramiteEmitidoDto: CreateTramiteEmitidoDto,
    @Req() request?: Request,
    // ): Promise<OutTramiteEmitidoDto> {
  ): Promise<any> {

    let digitalFiles: { IdFM: number }[] = createTramiteEmitidoDto.DigitalFiles.map((df) => ({ IdFM: +df.IdFM.split("_")[1] }));

    let tramiteDestinos: CreateMovimientoDto[] = createTramiteEmitidoDto.TramiteDestinos;

    let anexos: CreateAnexoDto[] = createTramiteEmitidoDto.Anexos;

    // printLog(digitalFiles);

    // printLog(tramiteDestinos);

    // printLog(anexos);

    delete createTramiteEmitidoDto.DigitalFiles;

    delete createTramiteEmitidoDto.TramiteDestinos;

    delete createTramiteEmitidoDto.Anexos;

    try {
      //we validate FKs
      const idAreaFound = await this.area.findOne(
        createTramiteEmitidoDto.IdAreaEmision,
      );
      if (idAreaFound.message.msgId === 1) return idAreaFound;

      const idTipoDocumentoFound = await this.tipoDocumento.findOne(
        createTramiteEmitidoDto.IdTipoDocumento,
      );
      if (idTipoDocumentoFound.message.msgId === 1) return idTipoDocumentoFound;

      const idTipoTramiteFound = await this.tipoTramite.findOne(
        createTramiteEmitidoDto.IdTipoTramite,
      );
      if (idTipoTramiteFound.message.msgId === 1) return idTipoTramiteFound;

      const idEstadoFound = await this.estado.findOne(
        createTramiteEmitidoDto.IdEstado,
      );
      if (idEstadoFound.message.msgId === 1) return idEstadoFound;

      const idRemitenteFound = await this.remitente.findOne(
        createTramiteEmitidoDto.IdRemitente,
      );
      if (idRemitenteFound.message.msgId === 1) return idRemitenteFound;


      const result = await this.prisma.$transaction(async (prisma) => {
        // we create the tramites emitido
        const tramiteEmitido = await prisma.tramite.create({
          data: {
            IdDocumento: digitalFiles[0].IdFM,
            Activo: createTramiteEmitidoDto.Activo,
            FechaInicio: createTramiteEmitidoDto.FechaInicio,
            IdTipoTramite: createTramiteEmitidoDto.IdTipoTramite,
            IdAreaEmision: createTramiteEmitidoDto.IdAreaEmision,
            IdEstado: createTramiteEmitidoDto.IdEstado,
            IdRemitente: createTramiteEmitidoDto.IdRemitente,
            CreadoEl: new Date().toISOString(),
            CreadoPor: `${request?.user?.id ?? 'test user'}`,
          },
          select: {
            IdTramite: true,
            IdAreaEmision: true,
            IdDocumento: true,
          }
        });

        // printLog(tramiteEmitido);

        if (tramiteEmitido && tramiteEmitido.IdTramite) {
          //b1-we update the data digital files(documentos)
          const responseDigitalFiles = await prisma.documento.update({
            where: {
              IdDocumento: tramiteEmitido.IdDocumento
            },
            data: {
              CodigoReferenciaDoc: createTramiteEmitidoDto.CodigoReferenciaDoc,
              Asunto: createTramiteEmitidoDto.Asunto,
              Observaciones: createTramiteEmitidoDto.Observaciones,
              Folios: createTramiteEmitidoDto.Folios,
              IdTipoDocumento: createTramiteEmitidoDto.IdTipoDocumento,
              IdEstado: 4// IdEstado - Adjuntado - 4
            },
            select: {
              IdDocumento: true,
              NombreDocumento: true,
              UrlDocumento: true,
            }

          })

          if (!responseDigitalFiles) {
            const customError = new Error('Error al actualizar estado del documento')
            customError.name = 'FAILD_TRAMITE_EMITIDO'
            throw customError
          }
          //b1-we update the digital files
          // const responseDigitalFiles = await Promise.all(
          //   digitalFiles?.map(async (df) => {
          //     const dataDF = await prisma.documento.update({
          //       where: { IdDocumento: df.IdFM },
          //       data: {
          //         // IdTramite: tramiteEmitido.IdTramite
          //         // IdEstado: 1,//cambiar a estado de adjuntado
          //         // IdTipoDocumento:1 // cambiar a un tipo de documento by default
          //       },
          //     })

          //     if (dataDF) {
          //       return {
          //         success: true,
          //         data: dataDF,
          //       }
          //     } else {
          //       return {
          //         success: false,
          //         error: "Error en actualizar el archivo digital",
          //       };
          //     }

          //   })
          // )

          // const failedResponseDigitalFiles = responseDigitalFiles.filter((r) => !r.success);

          // if (failedResponseDigitalFiles.length > 0) {
          //   const customError = new Error('Error en actualizar los archivos digitales')
          //   customError.name = 'FAILD_TRAMITE_EMITIDO'
          //   throw customError
          // }
          //b1---------------------------------------

          //b2-we create the tramites destino
          tramiteDestinos = tramiteDestinos.map((destino) => {
            return {
              IdTramite: tramiteEmitido.IdTramite,
              IdAreaOrigen: tramiteEmitido.IdAreaEmision,
              IdAreaDestino: destino.IdAreaDestino,
              FechaMovimiento: destino.FechaMovimiento,
              Copia: destino.Copia,
              FirmaDigital: destino.FirmaDigital,
              IdMovimientoPadre: null,
              NombreResponsable: destino.NombreResponsable?.NombreCompleto ? destino.NombreResponsable.NombreCompleto : destino.NombreResponsable,
              Activo: destino.Activo,
              CreadoEl: new Date().toISOString(),
              CreadoPor: `${request?.user?.id ?? 'test user'}`,
            }
          })

          const responseDestinos = await Promise.all(
            tramiteDestinos?.map(async (destino: Movimiento) => {
              //we create movimientos
              const dataDestino = await prisma.movimiento.create({
                data: destino,
              })

              if (dataDestino) {
                //we create the historial movimiento x estado 
                const dataHxE = await prisma.historialMovimientoxEstado.create({
                  data: {
                    IdEstado: 15, // IdEstado - Pendiente - 15
                    IdMovimiento: dataDestino.IdMovimiento,
                    Activo: true,
                    CreadoEl: new Date().toISOString(),
                    CreadoPor: `${request?.user?.id ?? 'test user'}`,
                  },
                })

                if (dataHxE) {
                  return {
                    success: true,
                    data: dataDestino,
                  }
                } else {
                  return {
                    success: false,
                    error: "Error en crear historialMxE",
                  };
                }
              } else {
                return {
                  success: false,
                  error: "Error en crear destino",
                };
              }
            })
          )

          const failedResponseDestinos = responseDestinos.filter((r) => !r.success);

          if (failedResponseDestinos.length > 0) {
            const customError = new Error('Error en crear los destinos')
            customError.name = 'FAILD_TRAMITE_EMITIDO'
            throw customError
          }
          //b2---------------------------------------

          //b3-we update the digital files
          anexos = anexos.map((anexo) => {
            return {
              Titulo: anexo.Titulo,
              FormatoAnexo: anexo.FormatoAnexo,
              NombreAnexo: anexo.NombreAnexo,
              UrlAnexo: anexo.UrlAnexo,
              SizeAnexo: anexo.SizeAnexo,
              UrlBase: anexo.UrlBase,
              IdDocumento: digitalFiles[0].IdFM,
              Activo: anexo.Activo,
              CreadoEl: new Date().toISOString(),
              CreadoPor: `${request?.user?.id ?? 'test user'}`,
            }
          })

          const responseAnexos = await Promise.all(
            anexos?.map(async (anexo: Anexo) => {
              const dataAnexo = await prisma.anexo.create({
                data: anexo,
              })

              if (dataAnexo) {
                return {
                  success: true,
                  data: dataAnexo,
                }
              } else {
                return {
                  success: false,
                  error: "Error en crear anexo",
                };
              }
            })
          )

          const failedResponseAnexos = responseAnexos.filter((r) => !r.success);

          if (failedResponseAnexos.length > 0) {
            const customError = new Error('Error en crear los anexos')
            customError.name = 'FAILD_TRAMITE_EMITIDO'
            throw customError
          }
          //b3---------------------------------------

          return {
            TramiteEmitido: tramiteEmitido,
            DigitalFiles: responseDigitalFiles,
            Destinos: responseDestinos,
            Anexos: responseAnexos
          }
        } else {
          const customError = new Error('Error al crear el trámite emitido')
          customError.name = 'FAILD_TRAMITE_EMITIDO'
          throw customError
        }
      })

      if (result?.TramiteEmitido?.IdTramite) {
        this.message.setMessage(0, 'Trámite - Registro creado');
        return { message: this.message, registro: result };
      } else {
        this.message.setMessage(1, 'Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      // if (error?.name === 'FAILD_TRAMITE_EMITIDO') {
      anexos.forEach(async (anexo) => {
        await this.file.remove({ PublicUrl: anexo.UrlAnexo })
      })
      // }

      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findAll(combinationsFiltersDto: CombinationsFiltersDto): Promise<OutTramitesDto> {
    try {
      let filtros = combinationsFiltersDto.filters;
      let cantidad_max = combinationsFiltersDto.cantidad_max;
      let clausula = this.filtersService.fabricarClausula(filtros);
      let limitRows = parseInt(cantidad_max) || 999;

      const tramites = await this.prisma.tramite.findMany({
        where: clausula,
        take: limitRows,
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
            },
          },
          TipoTramite: {
            select: {
              IdTipoTramite: true,
              Descripcion: true,
            },
          },

          Area: {
            select: {
              IdArea: true,
              Descripcion: true,
            },
          },
          Estado: {
            select: {
              IdEstado: true,
              Descripcion: true,
              EsquemaEstado: {
                select: {
                  IdEsquemaEstado: true,
                  Descripcion: true,
                },
              },
            },
          },
          Activo: true,
          CreadoEl: true,
          CreadoPor: true,
          ModificadoEl: true,
          ModificadoPor: true,
          Documento: {
            select: {
              IdDocumento: true,
              NombreDocumento: true,
              UrlDocumento: true,
              CodigoReferenciaDoc: true,
              Asunto: true,
              Observaciones: true,
              Folios: true,
              TipoDocumento: {
                select: {
                  IdTipoDocumento: true,
                  Descripcion: true,
                }
              },
              Anexo: {
                select: {
                  IdAnexo: true,
                  NombreAnexo: true,
                  UrlAnexo: true,
                }
              },
            },
          },
          Movimiento: {
            select: {
              IdMovimiento: true,
              AreaDestino: {
                select: {
                  Descripcion: true,
                }
              }
            },
          }
        },
      });

      if (tramites) {
        this.message.setMessage(0, 'Trámite - Registros encontrados');
        return { message: this.message, registro: tramites };
      } else {
        this.message.setMessage(1, 'Error: Trámite - Registros no encontrados');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findAllPendientes(getAllTramitePendienteDto: GetAllTramitePendienteDto): Promise<OutTramitesPendienteDto> {
    try {

      const tramites = await this.prisma.movimiento.findMany({
        where: {
          HistorialMovimientoxEstado: {
            every: {
              Estado: {
                IdEstado: 15// IdEstado - Pendiente - 15
              }
            }
          },
          IdAreaDestino: getAllTramitePendienteDto.IdAreaDestino,
        },
        select: {
          Documento: {
            select: {
              IdDocumento: true,
              CodigoReferenciaDoc: true,
              Asunto: true,
              Folios: true,
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
          FechaMovimiento: true,

          // si en el movimiento solo hay documento solo a nivel de tramite, se toma ese
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
                  NroIdentificacion: true
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
              Documento: {
                select: {
                  IdDocumento: true,
                  CodigoReferenciaDoc: true,
                  Asunto: true,
                  Folios: true,
                  TipoDocumento: {
                    select: {
                      IdTipoDocumento: true,
                      Descripcion: true,
                    }
                  },
                },
              },
            }
          },
        }

      })



      if (tramites) {
        this.message.setMessage(0, 'Trámite - Registros encontrados');
        return { message: this.message, registro: tramites };
      } else {
        this.message.setMessage(1, 'Error: Trámite - Registros no encontrados');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async findOne(id: number): Promise<OutTramiteDto> {
    try {
      const tramite = await this.prisma.tramite.findUnique({
        where: { IdTramite: id },
        select: this.customOut,
      });

      if (tramite) {
        this.message.setMessage(0, 'Trámite - Registro encontrado');
        return { message: this.message, registro: tramite };
      } else {
        this.message.setMessage(1, 'Error: Trámite - Registro no encontrado');
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
    updateTramiteDto: UpdateTramiteDto,
    @Req() request?: Request,
  ): Promise<OutTramiteDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const idTipoTramite = updateTramiteDto.IdTipoTramite;
      if (idTipoTramite) {
        const idTipoTramiteFound =
          await this.tipoTramite.findOne(idTipoTramite);
        if (idTipoTramiteFound.message.msgId === 1) return idTipoTramiteFound;
      }

      const idEstado = updateTramiteDto.IdEstado;
      if (idEstado) {
        const idEstadoFound = await this.estado.findOne(idEstado);
        if (idEstadoFound.message.msgId === 1) return idEstadoFound;
      }

      const idRemitente = updateTramiteDto.IdRemitente;
      if (idRemitente) {
        const idRemitenteFound = await this.remitente.findOne(idRemitente);
        if (idRemitenteFound.message.msgId === 1) return idRemitenteFound;
      }

      const tramite = await this.prisma.tramite.update({
        where: { IdTramite: id },
        data: {
          ...updateTramiteDto,
          ModificadoPor: `${request?.user?.id ?? 'test user'}`,
        },
      });

      if (tramite) {
        this.message.setMessage(0, 'Trámite - Registro actualizado');
        return { message: this.message, registro: tramite };
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

  async remove(id: number): Promise<OutTramiteDto> {
    try {
      const idFound = await this.findOne(id);
      if (idFound.message.msgId === 1) return idFound;

      const tramite = await this.prisma.tramite.delete({
        where: { IdTramite: id },
      });

      if (tramite) {
        this.message.setMessage(0, 'Trámite - Registro eliminado');
        return { message: this.message, registro: tramite };
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
