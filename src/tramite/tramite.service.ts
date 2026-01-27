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
import { OutTramiteDto, OutTramiteEmitidoDto, OutTramitesDto, OutTramitesPendienteDto, OutTramitesRecibidoDto } from './dto/out-tramite.dto';
import { OutTipoTramitesDto } from 'src/tipo-tramite/dto/out-tipo-tramite.dto';
import { CreateTramiteEmitidoDto } from './dto/create-tramite-emitido.dto';
import { FileManager } from 'src/file-manager/entities/file-manager.entity';
import { Movimiento } from 'src/movimiento/entities/movimiento.entity';
import { Anexo } from 'src/anexo/entities/anexo.entity';
import { delay, printLog } from 'src/utils/utils';
import { CreateMovimientoDto } from 'src/movimiento/dto/create-movimiento.dto';
import { FileService } from 'src/file/file.service';
import { CreateAnexoDto } from 'src/anexo/dto/create-anexo.dto';
import { TipoDocumentoService } from 'src/tipo-documento/tipo-documento.service';
import { AreaService } from 'src/area/area.service';
import { GetAllTramitePendienteDto } from './dto/get-all-tramite-pediente.dto';
import { DesmarcarRecibirTramiteDto, HistoriaLMxEDto, RecibirTramiteDto } from './dto/recibir-tramite.dto';
import { GetAllTramiteRecibidoDto } from './dto/get-all-tramite-recibido.dto';
import { DigitalFile, RecibirTramiteExterno2Dto, RecibirTramiteExternoDto } from './dto/recibir-tramite-externo.dto';
import { AtenderTramiteDto, DesmarcarAtenderTramiteDto } from './dto/atender-tramite.dto';
import { DesmarcarObservarTramiteDto, ObservarTramiteDto } from './dto/observar-tramite.dto';
import { ArchivarTramiteDto, DesmarcarArchivarTramiteDto, HistoriaLMxEDto1 } from './dto/archivar-tramite.dto';
import { CreateTramiteRecibidoAtendidoDto } from './dto/create-tramite-recibido-atendido.dto';
import { DerivarTramiteDto } from './dto/derivar-tramite.dto';

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
        const DateNow = new Date().toISOString()
        const tramiteEmitido = await prisma.tramite.create({
          data: {
            IdDocumento: digitalFiles[0]?.IdFM || null,
            Activo: createTramiteEmitidoDto.Activo,
            FechaInicio: createTramiteEmitidoDto.FechaInicio,
            IdTipoTramite: createTramiteEmitidoDto.IdTipoTramite,
            IdAreaEmision: createTramiteEmitidoDto.IdAreaEmision,
            IdEstado: createTramiteEmitidoDto.IdEstado,
            IdRemitente: createTramiteEmitidoDto.IdRemitente,
            CreadoEl: DateNow,
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
          let responseDigitalFiles = null

          if (tramiteEmitido.IdDocumento) {
            responseDigitalFiles = await prisma.documento.update({
              where: {
                IdDocumento: tramiteEmitido.IdDocumento
              },
              data: {
                CodigoReferenciaDoc: createTramiteEmitidoDto.CodigoReferenciaDoc,
                Asunto: createTramiteEmitidoDto.Asunto,
                Observaciones: createTramiteEmitidoDto.Observaciones,
                Folios: createTramiteEmitidoDto.Folios,
                IdTipoDocumento: createTramiteEmitidoDto.IdTipoDocumento,
                IdEstado: 4,// IdEstado - Adjuntado - 4
                ModificadoEl: DateNow,
                ModificadoPor: `${request?.user?.id ?? 'test user'}`,
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
          } else {
            responseDigitalFiles = await prisma.documento.create({
              data: {
                CodigoReferenciaDoc: createTramiteEmitidoDto.CodigoReferenciaDoc,
                Asunto: createTramiteEmitidoDto.Asunto,
                Observaciones: createTramiteEmitidoDto.Observaciones,
                Folios: createTramiteEmitidoDto.Folios,
                IdTipoDocumento: createTramiteEmitidoDto.IdTipoDocumento,
                IdEstado: 4,// IdEstado - Adjuntado - 4
                CreadoEl: DateNow,
                CreadoPor: `${request?.user?.id ?? 'test user'}`,
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

            const tramiteEmitidoUpdate = await prisma.tramite.update({
              where: {
                IdTramite: tramiteEmitido.IdTramite
              },
              data: {
                IdDocumento: responseDigitalFiles.IdDocumento,
              },
              select: {
                IdTramite: true,
                IdAreaEmision: true,
                IdDocumento: true,
              }
            })

            if (!tramiteEmitidoUpdate) {
              const customError = new Error('Error al actualizar estado del documento')
              customError.name = 'FAILD_TRAMITE_EMITIDO'
              throw customError
            }

            digitalFiles.push({ IdFM: tramiteEmitidoUpdate.IdDocumento })
          }
          //b1-we update the digital files
          // const responseDigitalFiles = await Promise.all(
          //   digitalFiles?.map(async (df) => {
          //     const dataDF = await prisma.documento.update({
          //       where: { IdDocumento: df.IdFM },
          //       data: {
          //         // IdTramite: tramiteEmitido.IdTramite
          //         // IdEstado: 1,//cambiar a estado de adjuntado
          //         // IdTipoDocumento:1, // cambiar a un tipo de documento by default
          //           ModificadoEl: new Date().toISOString(),
          // ModificadoPor: `${request?.user?.id ?? 'test user'}`,
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
              IdDocumento: digitalFiles[0]?.IdFM || null,
              FirmaDigital: destino.FirmaDigital,
              IdMovimientoPadre: null,
              NombreResponsable: destino.NombreResponsable?.NombreCompleto ? destino.NombreResponsable.NombreCompleto : destino.NombreResponsable,
              Activo: destino.Activo,
              CreadoEl: DateNow,
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
                    CreadoEl: DateNow,
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
              IdDocumento: digitalFiles[0]?.IdFM,
              Activo: anexo.Activo,
              CreadoEl: DateNow,
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
            DigitalFiles: responseDigitalFiles || null,
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

  async derivar(
    derivarTramiteDto: DerivarTramiteDto,
    request?: Request,
    // ): Promise<OutTramiteEmitidoDto> {
  ): Promise<any> {

    let digitalFiles: { IdFM: number }[] = derivarTramiteDto.DigitalFiles.map((df) => ({ IdFM: +df.IdFM.split("_")[1] }));

    let tramiteDestinos: CreateMovimientoDto[] = derivarTramiteDto.TramiteDestinos;

    let anexos: CreateAnexoDto[] = derivarTramiteDto.Anexos;

    let typeTab = derivarTramiteDto.TypeTab;

    let responseAnexos: {
      success: boolean;
      data: {
        Activo: boolean;
        CreadoEl: Date;
        CreadoPor: string;
        ModificadoEl: Date;
        ModificadoPor: string;
        IdDocumento: number;
        IdAnexo: number;
        Titulo: string;
        FormatoAnexo: string;
        NombreAnexo: string;
        UrlAnexo: string;
        SizeAnexo: number;
        UrlBase: string;
      };
      error?: undefined;
    } | {
      success: boolean;
      error: string;
      data?: undefined;
    }[];

    // printLog(digitalFiles);

    // printLog(tramiteDestinos);

    // printLog(anexos);

    delete derivarTramiteDto.DigitalFiles;

    delete derivarTramiteDto.TramiteDestinos;

    delete derivarTramiteDto.Anexos;

    try {
      //we validate FKs
      const idAreaFound = await this.area.findOne(
        derivarTramiteDto.IdAreaEmision,
      );
      if (idAreaFound.message.msgId === 1) return idAreaFound;

      const idTipoDocumento = derivarTramiteDto.IdTipoDocumento;
      if (idTipoDocumento) {
        const idTipoDocumentoFound =
          await this.tipoDocumento.findOne(idTipoDocumento);
        if (idTipoDocumentoFound.message.msgId === 1) return idTipoDocumentoFound;
      }

      const idEstadoFound = await this.estado.findOne(
        derivarTramiteDto.IdEstado,
      );
      if (idEstadoFound.message.msgId === 1) return idEstadoFound;


      const idRemitente = derivarTramiteDto.IdRemitente;
      if (idRemitente) {
        const idRemitenteFound =
          await this.remitente.findOne(idRemitente);
        if (idRemitenteFound.message.msgId === 1) return idRemitenteFound;
      }

      const result = await this.prisma.$transaction(async (prisma) => {

        // b1-we update the data digital files(documentos)
        let responseDigitalFiles: {
          IdDocumento: number;
          NombreDocumento: string;
          UrlDocumento: string;
        } | null = null;

        if (digitalFiles[0]?.IdFM) {
          responseDigitalFiles = await prisma.documento.update({
            where: {
              IdDocumento: digitalFiles[0]?.IdFM
            },
            data: {
              IdUsuario: derivarTramiteDto.IdRemitente,
              IdEstado: derivarTramiteDto.IdEstado,// IdEstado - Adjuntado - 4
              Asunto: derivarTramiteDto.Asunto,
              Observaciones: derivarTramiteDto.Observaciones,
              Folios: derivarTramiteDto.Folios,
              CodigoReferenciaDoc: derivarTramiteDto.CodigoReferenciaDoc,
              IdTipoDocumento: derivarTramiteDto.IdTipoDocumento,
              Visible: derivarTramiteDto.Visible,
              ModificadoEl: new Date().toISOString(),
              ModificadoPor: `${request?.user?.id ?? 'test user'}`,
            },
            select: {
              IdDocumento: true,
              NombreDocumento: true,
              UrlDocumento: true,
            }
          })

          if (!responseDigitalFiles) {
            const customError = new Error('Error al actualizar documento')
            customError.name = 'FAILD_TRAMITE_EMITIDO'
            throw customError
          }
        } else {
          if (typeTab) {
            responseDigitalFiles = await prisma.documento.create({
              data: {
                CodigoReferenciaDoc: derivarTramiteDto.CodigoReferenciaDoc,
                Asunto: derivarTramiteDto.Asunto,
                Observaciones: derivarTramiteDto.Observaciones,
                Folios: derivarTramiteDto.Folios,
                IdTipoDocumento: derivarTramiteDto.IdTipoDocumento,
                IdEstado: 4,// IdEstado - Adjuntado - 4
                ModificadoEl: new Date().toISOString(),
                ModificadoPor: `${request?.user?.id ?? 'test user'}`,
              },
              select: {
                IdDocumento: true,
                NombreDocumento: true,
                UrlDocumento: true,
              }

            })

            if (!responseDigitalFiles) {
              const customError = new Error('Error al crear documento')
              customError.name = 'FAILD_TRAMITE_EMITIDO'
              throw customError
            }

            digitalFiles.push({ IdFM: responseDigitalFiles.IdDocumento })
          } else {
            const idMovimiento = derivarTramiteDto.Movimientos[0].IdMovimiento

            const movimiento = await this.prisma.movimiento.findUnique({
              where: { IdMovimiento: idMovimiento },
              select: {
                IdTramite: true,
                IdMovimiento: true,
                Documento: true,
              }
            })

            responseDigitalFiles = await prisma.documento.findUnique({
              where: {
                IdDocumento: movimiento.Documento.IdDocumento
              },
              select: {
                IdDocumento: true,
                NombreDocumento: true,
                UrlDocumento: true,
              }
            })

            if (!responseDigitalFiles) {
              const customError = new Error('Error al actualizar documento')
              customError.name = 'FAILD_TRAMITE_EMITIDO'
              throw customError
            }

            digitalFiles.push({ IdFM: responseDigitalFiles.IdDocumento })
          }
        }
        //b1---------------------------------------

        let dataHxEArray: {
          IdDocumento: number;
          Estado: {
            Descripcion: string;
            IdEstado: number;
          };
          Movimiento: {
            IdMovimiento: number;
          };
          IdHistorialMxE: number;
          FechaHistorialMxE: Date;
        }[] = []

        await Promise.all(
          derivarTramiteDto.Movimientos.map(async (mov) => {
            //b2 we create the HxE
            const dataHxEFound = await prisma.historialMovimientoxEstado.findFirst({
              where: {
                IdEstado: 17, // IdEstado - Derivado - 17
                IdMovimiento: mov.IdMovimiento,
              },
              select: {
                IdHistorialMxE: true,
                FechaHistorialMxE: true,
                IdDocumento: true,
                Estado: {
                  select: {
                    IdEstado: true,
                    Descripcion: true
                  }
                },
                Movimiento: {
                  select: {
                    IdMovimiento: true
                  }
                }
              }
            })

            if (dataHxEFound?.IdHistorialMxE) {
              dataHxEArray.push(dataHxEFound)
            } else {

              const dataHxE = await prisma.historialMovimientoxEstado.create({
                data: {
                  IdEstado: 17, // IdEstado - Derivado - 17
                  IdMovimiento: mov.IdMovimiento,
                  Observaciones: derivarTramiteDto.Observaciones,
                  IdDocumento: digitalFiles[0]?.IdFM || null,
                  FechaHistorialMxE: new Date().toISOString(),
                  Activo: true,
                  CreadoEl: new Date().toISOString(),
                  CreadoPor: `${request?.user?.id ?? 'test user'}`,
                },
                select: {
                  IdHistorialMxE: true,
                  FechaHistorialMxE: true,
                  IdDocumento: true,
                  Estado: {
                    select: {
                      IdEstado: true,
                      Descripcion: true
                    }
                  },
                  Movimiento: {
                    select: {
                      IdMovimiento: true
                    }
                  }
                }
              })

              if (dataHxE) {
                dataHxEArray.push(dataHxE)
              } else {
                const customError = new Error('Error en crear los HxE')
                customError.name = 'FAILD_TRAMITE_EMITIDO'
                throw customError
              }
            }
            //b2---------------------------------------

            //b2-we create the tramites destino
            tramiteDestinos = tramiteDestinos.map((destino) => {
              return {
                IdTramite: mov.Tramite.IdTramite,
                IdAreaOrigen: derivarTramiteDto.IdAreaEmision,
                IdAreaDestino: destino.IdAreaDestino,
                FechaMovimiento: destino.FechaMovimiento,
                Copia: destino.Copia,
                IdDocumento: digitalFiles[0]?.IdFM ? digitalFiles[0]?.IdFM : null,//change here
                // IdDocumento:  null,//change here
                FirmaDigital: destino.FirmaDigital,
                IdMovimientoPadre: mov.IdMovimiento,
                NombreResponsable: destino.NombreResponsable?.NombreCompleto ? destino.NombreResponsable.NombreCompleto : destino.NombreResponsable,
                Acciones: derivarTramiteDto.Acciones,
                Indicaciones: derivarTramiteDto.Indicaciones,
                // Observaciones: derivarTramiteDto.Observaciones,
                Activo: destino.Activo,
                CreadoEl: new Date().toISOString(),
                CreadoPor: `${request?.user?.id ?? 'test user'}`,
              }
            })

            const responseDestinos = await Promise.all(
              tramiteDestinos?.map(async (destino: Movimiento) => {
                //we create movimientos
                const dataDestino = await prisma.movimiento.create({
                  data: {
                    IdTramite: destino.IdTramite,
                    IdAreaOrigen: destino.IdAreaOrigen,
                    IdAreaDestino: destino.IdAreaDestino,
                    FechaMovimiento: destino.FechaMovimiento,
                    Copia: destino.Copia,
                    IdDocumento: destino.IdDocumento,
                    FirmaDigital: destino.FirmaDigital,
                    IdMovimientoPadre: destino.IdMovimientoPadre,
                    NombreResponsable: destino.NombreResponsable,
                    Acciones: destino.Acciones,
                    Indicaciones: destino.Indicaciones,
                    // Observaciones: destino.Observaciones,
                    Activo: destino.Activo,
                    CreadoEl: new Date().toISOString(),
                    CreadoPor: `${request?.user?.id ?? 'test user'}`,
                  },
                })

                if (dataDestino) {
                  //we create the historial movimiento x estado 
                  const dataHxE = await prisma.historialMovimientoxEstado.create({
                    data: {
                      IdEstado: 15, // IdEstado - Pendiente - 15
                      IdMovimiento: dataDestino.IdMovimiento,
                      FechaHistorialMxE: new Date().toISOString(),
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
          })

        )







        //b3-we update the digital files
        if (anexos?.length > 0) {
          anexos = anexos.map((anexo) => {
            return {
              Titulo: anexo.Titulo,
              FormatoAnexo: anexo.FormatoAnexo,
              NombreAnexo: anexo.NombreAnexo,
              UrlAnexo: anexo.UrlAnexo,
              SizeAnexo: anexo.SizeAnexo,
              UrlBase: anexo.UrlBase,
              IdDocumento: digitalFiles[0]?.IdFM,
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
        }
        //b3---------------------------------------

        return {
          DigitalFiles: responseDigitalFiles || null,
          // Destinos: responseDestinos,
          Anexos: responseAnexos,
          DataHxEArray: dataHxEArray,
        }
        // } else {
        //   const customError = new Error('Error al crear el trámite emitido')
        //   customError.name = 'FAILD_TRAMITE_EMITIDO'
        //   throw customError
        // }
      })

      if (result?.DataHxEArray?.length > 0) {
        this.message.setMessage(0, 'Trámite - Registro creado');
        return { message: this.message, registro: result.DataHxEArray };
      } else {
        this.message.setMessage(1, 'Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      // if (error?.name === 'FAILD_TRAMITE_EMITIDO') {
      if (anexos?.length > 0) {
        anexos.forEach(async (anexo) => {
          await this.file.remove({ PublicUrl: anexo.UrlAnexo })
        })
      }
      // }

      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async recibirExterno(
    recibirTramiteExternoDto: RecibirTramiteExternoDto,
    @Req() request?: Request,
  ): Promise<OutTramiteEmitidoDto> {
    // ): Promise<any> {

    let digitalFiles: { IdFM: number }[] = recibirTramiteExternoDto.DigitalFiles.map((df) => ({ IdFM: +df.IdFM.split("_")[1] }));

    let tramiteDestinos: CreateMovimientoDto[] = recibirTramiteExternoDto.TramiteDestinos;

    let anexos: CreateAnexoDto[] = recibirTramiteExternoDto.Anexos;

    // printLog(digitalFiles);

    // printLog(tramiteDestinos);

    // printLog(anexos);

    delete recibirTramiteExternoDto.DigitalFiles;

    delete recibirTramiteExternoDto.TramiteDestinos;

    delete recibirTramiteExternoDto.Anexos;

    try {
      //we validate FKs
      const idAreaFound = await this.area.findOne(
        recibirTramiteExternoDto.IdAreaEmision,
      );
      if (idAreaFound.message.msgId === 1) return idAreaFound;

      const idTipoDocumentoFound = await this.tipoDocumento.findOne(
        recibirTramiteExternoDto.IdTipoDocumento,
      );
      if (idTipoDocumentoFound.message.msgId === 1) return idTipoDocumentoFound;

      const idTipoTramiteFound = await this.tipoTramite.findOne(
        recibirTramiteExternoDto.IdTipoTramite,
      );
      if (idTipoTramiteFound.message.msgId === 1) return idTipoTramiteFound;

      const idEstadoFound = await this.estado.findOne(
        recibirTramiteExternoDto.IdEstado,
      );
      if (idEstadoFound.message.msgId === 1) return idEstadoFound;

      // const idRemitenteFound = await this.remitente.findOne(
      //   recibirTramiteExternoDto.IdRemitente,
      // );
      // if (idRemitenteFound.message.msgId === 1) return idRemitenteFound;

      const result = await this.prisma.$transaction(async (prisma) => {
        // we create the usuario
        let remitente = null

        const remitenteFound = await prisma.usuario.findFirst({
          where: {
            Email: recibirTramiteExternoDto.Email,
            // IdRol:''
          },
          select: {
            IdUsuario: true,
            Nombres: true,
            ApellidoPaterno: true,
            ApellidoMaterno: true,
          }
        })

        if (remitenteFound?.IdUsuario) {
          remitente = remitenteFound
        } else {
          const remitenteCreate = await prisma.usuario.create({
            data: {
              Nombres: recibirTramiteExternoDto.Nombres,
              ApellidoPaterno: recibirTramiteExternoDto.ApellidoPaterno,
              ApellidoMaterno: recibirTramiteExternoDto.ApellidoMaterno,
              Email: recibirTramiteExternoDto.Email,
              Celular: recibirTramiteExternoDto.Celular,
              Direccion: recibirTramiteExternoDto.Direccion,
              RazonSocial: recibirTramiteExternoDto.RazonSocial,
              IdTipoIdentificacion: recibirTramiteExternoDto.RazonSocial != '' ? 2 : 1,
              NroIdentificacion: recibirTramiteExternoDto.NroIdentificacion,
              IdTipoUsuario: recibirTramiteExternoDto.IdTipoUsuario,
              IdRol: recibirTramiteExternoDto.IdRol,
              CreadoPor: `${request?.user?.id ?? 'test user'}`,
              CreadoEl: new Date().toISOString(),
            },
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
            }
          })

          if (remitenteCreate.IdUsuario) {
            remitente = remitenteCreate
          } else {
            const customError = new Error('Error al crear remitente')
            customError.name = 'FAILD_TRAMITE_EMITIDO'
            throw customError
          }
        }

        // we create the tramites emitido
        const tramiteEmitido = await prisma.tramite.create({
          data: {
            IdDocumento: digitalFiles[0]?.IdFM || null,
            Activo: recibirTramiteExternoDto.Activo,
            FechaInicio: recibirTramiteExternoDto.FechaInicio,
            IdTipoTramite: recibirTramiteExternoDto.IdTipoTramite,
            IdAreaEmision: recibirTramiteExternoDto.IdAreaEmision,
            IdEstado: recibirTramiteExternoDto.IdEstado,
            IdRemitente: remitente.IdUsuario,
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
          let responseDigitalFiles = null

          if (tramiteEmitido.IdDocumento) {
            responseDigitalFiles = await prisma.documento.update({
              where: {
                IdDocumento: tramiteEmitido.IdDocumento
              },
              data: {
                CodigoReferenciaDoc: recibirTramiteExternoDto.CodigoReferenciaDoc,
                Asunto: recibirTramiteExternoDto.Asunto,
                Observaciones: recibirTramiteExternoDto.Observaciones,
                Folios: recibirTramiteExternoDto.Folios,
                IdTipoDocumento: recibirTramiteExternoDto.IdTipoDocumento,
                IdEstado: 4,// IdEstado - Adjuntado - 4
                ModificadoEl: new Date().toISOString(),
                ModificadoPor: `${request?.user?.id ?? 'test user'}`,
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
          } else {
            responseDigitalFiles = await prisma.documento.create({
              data: {
                CodigoReferenciaDoc: recibirTramiteExternoDto.CodigoReferenciaDoc,
                Asunto: recibirTramiteExternoDto.Asunto,
                Observaciones: recibirTramiteExternoDto.Observaciones,
                Folios: recibirTramiteExternoDto.Folios,
                IdTipoDocumento: recibirTramiteExternoDto.IdTipoDocumento,
                IdEstado: 4,// IdEstado - Adjuntado - 4
                CreadoEl: new Date().toISOString(),
                CreadoPor: `${request?.user?.id ?? 'test user'}`,
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

            const tramiteEmitidoUpdate = await prisma.tramite.update({
              where: {
                IdTramite: tramiteEmitido.IdTramite
              },
              data: {
                IdDocumento: responseDigitalFiles.IdDocumento,
              },
              select: {
                IdTramite: true,
                IdAreaEmision: true,
                IdDocumento: true,
              }
            })

            if (!tramiteEmitidoUpdate) {
              const customError = new Error('Error al actualizar estado del documento')
              customError.name = 'FAILD_TRAMITE_EMITIDO'
              throw customError
            }

            digitalFiles.push({ IdFM: tramiteEmitidoUpdate.IdDocumento })
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
          //           ModificadoEl: new Date().toISOString(),
          // ModificadoPor: `${request?.user?.id ?? 'test user'}`,
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
              IdDocumento: digitalFiles[0]?.IdFM || null,
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

                await delay(1000);

                if (dataHxE) {
                  const dataHxE2 = await prisma.historialMovimientoxEstado.create({
                    data: {
                      IdEstado: 16, // IdEstado - Recibido - 16
                      IdMovimiento: dataDestino.IdMovimiento,
                      Observaciones: recibirTramiteExternoDto.Observaciones,
                      FechaHistorialMxE: new Date().toISOString(),
                      Activo: true,
                      CreadoEl: new Date().toISOString(),
                      CreadoPor: `${request?.user?.id ?? 'test user'}`,
                    },
                  })

                  if (dataHxE && dataHxE2) {
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
              IdDocumento: digitalFiles[0]?.IdFM,
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
            DigitalFiles: responseDigitalFiles || null,
            // Destinos: responseDestinos,
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

  async recibirExterno2(
    recibirTramiteExternoDto: RecibirTramiteExterno2Dto,
    @Req() request?: Request,
  ): Promise<OutTramiteEmitidoDto> {
    // ): Promise<any> {

    let digitalFiles: DigitalFile[] = [...recibirTramiteExternoDto.DigitalFiles]

    let tramiteDestinos: CreateMovimientoDto[] = recibirTramiteExternoDto.TramiteDestinos;

    let anexos: CreateAnexoDto[] = recibirTramiteExternoDto.Anexos;

    // printLog(digitalFiles);

    // printLog(tramiteDestinos);

    // printLog(anexos);

    delete recibirTramiteExternoDto.DigitalFiles;

    delete recibirTramiteExternoDto.TramiteDestinos;

    delete recibirTramiteExternoDto.Anexos;

    try {
      //we validate FKs
      const idAreaFound = await this.area.findOne(
        recibirTramiteExternoDto.IdAreaEmision,
      );
      if (idAreaFound.message.msgId === 1) return idAreaFound;

      const idTipoDocumentoFound = await this.tipoDocumento.findOne(
        recibirTramiteExternoDto.IdTipoDocumento,
      );
      if (idTipoDocumentoFound.message.msgId === 1) return idTipoDocumentoFound;

      const idTipoTramiteFound = await this.tipoTramite.findOne(
        recibirTramiteExternoDto.IdTipoTramite,
      );
      if (idTipoTramiteFound.message.msgId === 1) return idTipoTramiteFound;

      const idEstadoFound = await this.estado.findOne(
        recibirTramiteExternoDto.IdEstado,
      );
      if (idEstadoFound.message.msgId === 1) return idEstadoFound;

      // const idRemitenteFound = await this.remitente.findOne(
      //   recibirTramiteExternoDto.IdRemitente,
      // );
      // if (idRemitenteFound.message.msgId === 1) return idRemitenteFound;

      const result = await this.prisma.$transaction(async (prisma) => {
        // we create the usuario
        let remitente = null

        const remitenteFound = await prisma.usuario.findFirst({
          where: {
            Email: recibirTramiteExternoDto.Email,
            IdRol: recibirTramiteExternoDto.IdRol
          },
          select: {
            IdUsuario: true,
            Nombres: true,
            ApellidoPaterno: true,
            ApellidoMaterno: true,
          }
        })

        if (remitenteFound?.IdUsuario) {
          remitente = remitenteFound
        } else {
          const remitenteCreate = await prisma.usuario.create({
            data: {
              Nombres: recibirTramiteExternoDto.Nombres,
              ApellidoPaterno: recibirTramiteExternoDto.ApellidoPaterno,
              ApellidoMaterno: recibirTramiteExternoDto.ApellidoMaterno,
              Email: recibirTramiteExternoDto.Email,
              Celular: recibirTramiteExternoDto.Celular,
              Direccion: recibirTramiteExternoDto.Direccion,
              RazonSocial: recibirTramiteExternoDto.RazonSocial,
              IdTipoIdentificacion: recibirTramiteExternoDto.RazonSocial != '' ? 2 : 1,
              NroIdentificacion: recibirTramiteExternoDto.NroIdentificacion,
              IdTipoUsuario: recibirTramiteExternoDto.IdTipoUsuario,
              IdRol: recibirTramiteExternoDto.IdRol,
              CreadoPor: `${request?.user?.id ?? 'test user'}`,
              CreadoEl: new Date().toISOString(),
            },
            select: {
              IdUsuario: true,
              Nombres: true,
              ApellidoPaterno: true,
              ApellidoMaterno: true,
            }
          })

          if (remitenteCreate.IdUsuario) {
            remitente = remitenteCreate
          } else {
            const customError = new Error('Error al crear remitente')
            customError.name = 'FAILD_TRAMITE_EMITIDO'
            throw customError
          }
        }

        // we create the tramites emitido
        const tramiteEmitido = await prisma.tramite.create({
          data: {
            IdDocumento: digitalFiles[0]?.Id || null,
            Activo: recibirTramiteExternoDto.Activo,
            FechaInicio: recibirTramiteExternoDto.FechaInicio,
            IdTipoTramite: recibirTramiteExternoDto.IdTipoTramite,
            IdAreaEmision: recibirTramiteExternoDto.IdAreaEmision,
            IdEstado: recibirTramiteExternoDto.IdEstado,
            IdRemitente: remitente.IdUsuario,
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
          let responseDigitalFiles = null

          if (tramiteEmitido.IdDocumento) {
            responseDigitalFiles = await prisma.documento.update({
              where: {
                IdDocumento: tramiteEmitido.IdDocumento
              },
              data: {
                CodigoReferenciaDoc: recibirTramiteExternoDto.CodigoReferenciaDoc,
                Asunto: recibirTramiteExternoDto.Asunto,
                Observaciones: recibirTramiteExternoDto.Observaciones,
                Folios: recibirTramiteExternoDto.Folios,
                IdTipoDocumento: recibirTramiteExternoDto.IdTipoDocumento,
                IdEstado: 4,// IdEstado - Adjuntado - 4
                ModificadoEl: new Date().toISOString(),
                ModificadoPor: `${request?.user?.id ?? 'test user'}`,
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
          } else {
            responseDigitalFiles = await prisma.documento.create({
              data: {
                CodigoReferenciaDoc: recibirTramiteExternoDto.CodigoReferenciaDoc,
                Asunto: recibirTramiteExternoDto.Asunto,
                Observaciones: recibirTramiteExternoDto.Observaciones,
                Folios: recibirTramiteExternoDto.Folios,
                IdTipoDocumento: recibirTramiteExternoDto.IdTipoDocumento,
                IdEstado: 4,// IdEstado - Adjuntado - 4

                Titulo: digitalFiles[0].Titulo,
                UrlBase: digitalFiles[0].UrlBase,
                UrlDocumento: digitalFiles[0].Url,
                NombreDocumento: digitalFiles[0].Nombre,
                SizeDocumento: digitalFiles[0].Size,
                FormatoDocumento: digitalFiles[0].Formato,

                CreadoEl: new Date().toISOString(),
                CreadoPor: `${request?.user?.id ?? 'test user'}`,
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

            const tramiteEmitidoUpdate = await prisma.tramite.update({
              where: {
                IdTramite: tramiteEmitido.IdTramite
              },
              data: {
                IdDocumento: responseDigitalFiles.IdDocumento,
              },
              select: {
                IdTramite: true,
                IdAreaEmision: true,
                IdDocumento: true,
              }
            })

            if (!tramiteEmitidoUpdate) {
              const customError = new Error('Error al actualizar estado del documento')
              customError.name = 'FAILD_TRAMITE_EMITIDO'
              throw customError
            }

            digitalFiles[0].Id = tramiteEmitidoUpdate.IdDocumento
          }

          //b2-we create the tramites destino
          tramiteDestinos = tramiteDestinos.map((destino) => {
            return {
              IdTramite: tramiteEmitido.IdTramite,
              IdAreaOrigen: tramiteEmitido.IdAreaEmision,
              IdAreaDestino: destino.IdAreaDestino,
              FechaMovimiento: destino.FechaMovimiento,
              Copia: destino.Copia,
              IdDocumento: digitalFiles[0]?.Id || null,
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

                await delay(1000);

                if (dataHxE) {
                  const dataHxE2 = await prisma.historialMovimientoxEstado.create({
                    data: {
                      IdEstado: 16, // IdEstado - Recibido - 16
                      IdMovimiento: dataDestino.IdMovimiento,
                      Observaciones: recibirTramiteExternoDto.Observaciones,
                      FechaHistorialMxE: new Date().toISOString(),
                      Activo: true,
                      CreadoEl: new Date().toISOString(),
                      CreadoPor: `${request?.user?.id ?? 'test user'}`,
                    },
                  })

                  if (dataHxE && dataHxE2) {
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
              IdDocumento: digitalFiles[0]?.Id,
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
            DigitalFiles: responseDigitalFiles || null,
            // Destinos: responseDestinos,
            Anexos: responseAnexos
          }
        } else {
          const customError = new Error('Error al crear el trámite emitido')
          customError.name = 'FAILD_TRAMITE_EMITIDO'
          throw customError
        }
      })

      if (result?.TramiteEmitido?.IdTramite) {

        //b4-send mail
        //b4---------------------------------------


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

  async recibir(RecibirTramiteDto: RecibirTramiteDto, @Req() request?: Request): Promise<any> {
    try {

      let movimientos: HistoriaLMxEDto[] = RecibirTramiteDto.Movimientos;

      const result = await this.prisma.$transaction(async (prisma) => {

        //b3
        movimientos = movimientos.map((movimiento) => {
          return {
            IdEstado: 16, // IdEstado - Recibido - 16
            IdMovimiento: movimiento.IdMovimiento,
            Observaciones: RecibirTramiteDto.Observaciones,
            FechaHistorialMxE: new Date().toISOString(),
            Activo: true,
            CreadoEl: new Date().toISOString(),
            CreadoPor: `${request?.user?.id ?? 'test user'}`,
          }
        })

        const responseMovimientos = await Promise.all(
          movimientos?.map(async (movimiento: HistoriaLMxEDto) => {
            const dataHxE = await prisma.historialMovimientoxEstado.create({
              data: movimiento,
            })

            if (dataHxE) {
              return {
                success: true,
                data: dataHxE,
              }
            } else {
              return {
                success: false,
                error: "Error en crear HxE",
              };
            }
          })
        )

        const failedResponseMovimientos = responseMovimientos.filter((r) => !r.success);

        if (failedResponseMovimientos.length > 0) {
          const customError = new Error('Error en crear los HxE')
          customError.name = 'FAILD_TRAMITE_EMITIDO'
          throw customError
        }
        //b3---------------------------------------

        return {
          Movimientos: responseMovimientos
        }

      })

      if (result?.Movimientos.length > 0) {
        this.message.setMessage(0, 'Trámite - Registro(s) recibido(s)');
        return { message: this.message, registro: result };
      } else {
        this.message.setMessage(1, 'Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async desmarcarRecibir(DesmarcarRecibirTramiteDto: DesmarcarRecibirTramiteDto): Promise<any> {
    try {

      const hMxEFound = await this.prisma.historialMovimientoxEstado.findFirst({
        where: {
          Movimiento: {
            IdMovimiento: DesmarcarRecibirTramiteDto.IdMovimiento
          }, Estado: {
            IdEstado: 16  // IdEstado - Recibido - 16
          }
        },
        select: {
          IdHistorialMxE: true
        }
      })

      if (!hMxEFound) {
        this.message.setMessage(1, 'Este movimiento no tiene estado recibido');
        return { message: this.message };
      }

      const hMxE = await this.prisma.historialMovimientoxEstado.delete({
        where: {
          IdHistorialMxE: hMxEFound.IdHistorialMxE
        },
        select: {
          IdHistorialMxE: true,
          FechaHistorialMxE: true,
          IdDocumento: true,
          Estado: {
            select: {
              IdEstado: true,
              Descripcion: true,
            }
          },
          Movimiento: {
            select: {
              IdMovimiento: true
            }
          }
        }
      })

      if (hMxE) {
        this.message.setMessage(0, 'Trámite - Registro(s) recibido(s)');
        return { message: this.message, registro: hMxE };
      } else {
        this.message.setMessage(1, 'Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async atender(atenderTramiteDto: AtenderTramiteDto, @Req() request?: Request): Promise<any> {
    try {

      let movimientos: HistoriaLMxEDto[] = atenderTramiteDto.Movimientos;

      const result = await this.prisma.$transaction(async (prisma) => {

        //b3 we create the HxE
        movimientos = movimientos.map((movimiento) => {
          return {
            IdEstado: 18, // IdEstado - Atendido - 18
            IdMovimiento: movimiento.IdMovimiento,
            Observaciones: atenderTramiteDto.Observaciones,
            FechaHistorialMxE: new Date().toISOString(),
            Activo: true,
            CreadoEl: new Date().toISOString(),
            CreadoPor: `${request?.user?.id ?? 'test user'}`,
          }
        })

        const responseMovimientos = await Promise.all(
          movimientos?.map(async (movimiento: HistoriaLMxEDto) => {
            const dataHxE = await prisma.historialMovimientoxEstado.create({
              data: movimiento,
              select: {
                IdHistorialMxE: true,
                FechaHistorialMxE: true,
                IdDocumento: true,
                Estado: {
                  select: {
                    IdEstado: true,
                    Descripcion: true
                  }
                },
                Movimiento: {
                  select: {
                    IdMovimiento: true
                  }
                }
              }
            })

            if (dataHxE) {
              return {
                success: true,
                data: dataHxE,
              }
            } else {
              return {
                success: false,
                error: "Error en crear HxE",
              };
            }
          })
        )

        const failedResponseMovimientos = responseMovimientos.filter((r) => !r.success);

        if (failedResponseMovimientos.length > 0) {
          const customError = new Error('Error en crear los HxE')
          customError.name = 'FAILD_TRAMITE_EMITIDO'
          throw customError
        }
        //b3---------------------------------------

        return {
          Movimientos: responseMovimientos.map((r) => r.data)
        }
      })

      if (result?.Movimientos.length > 0) {
        this.message.setMessage(0, 'Trámite - Registro(s) recibido(s)');
        return { message: this.message, registro: result.Movimientos };
      } else {
        this.message.setMessage(1, 'Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async atender2(
    createTramiteRecibidoAtendidoDto: CreateTramiteRecibidoAtendidoDto,
    @Req() request?: Request,
    // ): Promise<OutTramiteEmitidoDto> {
  ): Promise<any> {

    let digitalFiles: { IdFM: number }[] = createTramiteRecibidoAtendidoDto.DigitalFiles.map((df) => ({ IdFM: +df.IdFM.split("_")[1] }));

    let anexos: CreateAnexoDto[] = createTramiteRecibidoAtendidoDto.Anexos;

    let responseAnexos: {
      success: boolean;
      data: {
        Activo: boolean;
        CreadoEl: Date;
        CreadoPor: string;
        ModificadoEl: Date;
        ModificadoPor: string;
        IdDocumento: number;
        IdAnexo: number;
        Titulo: string;
        FormatoAnexo: string;
        NombreAnexo: string;
        UrlAnexo: string;
        SizeAnexo: number;
        UrlBase: string;
      };
      error?: undefined;
    } | {
      success: boolean;
      error: string;
      data?: undefined;
    }[];

    // printLog(digitalFiles);

    // printLog(tramiteDestinos);

    // printLog(anexos);

    delete createTramiteRecibidoAtendidoDto.DigitalFiles;

    delete createTramiteRecibidoAtendidoDto.Anexos;

    try {
      //we validate FKs
      const idTipoDocumentoFound = await this.tipoDocumento.findOne(
        createTramiteRecibidoAtendidoDto.IdTipoDocumento,
      );
      if (idTipoDocumentoFound.message.msgId === 1) return idTipoDocumentoFound;

      const idEstadoFound = await this.estado.findOne(
        createTramiteRecibidoAtendidoDto.IdEstado,
      );
      if (idEstadoFound.message.msgId === 1) return idEstadoFound;

      const idRemitenteFound = await this.remitente.findOne(
        createTramiteRecibidoAtendidoDto.IdRemitente,
      );
      if (idRemitenteFound.message.msgId === 1) return idRemitenteFound;

      const result = await this.prisma.$transaction(async (prisma) => {

        // b1-we update the data digital files(documentos)
        let responseDigitalFiles = null

        if (digitalFiles[0].IdFM) {
          responseDigitalFiles = await prisma.documento.update({
            where: {
              IdDocumento: digitalFiles[0]?.IdFM
            },
            data: {
              IdUsuario: createTramiteRecibidoAtendidoDto.IdRemitente,
              IdEstado: createTramiteRecibidoAtendidoDto.IdEstado,// IdEstado - Adjuntado - 4
              Observaciones: createTramiteRecibidoAtendidoDto.Observaciones,
              Visible: createTramiteRecibidoAtendidoDto.Visible,
              ModificadoEl: new Date().toISOString(),
              ModificadoPor: `${request?.user?.id ?? 'test user'}`,
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
        } else {
          responseDigitalFiles = await prisma.documento.create({
            data: {
              CodigoReferenciaDoc: createTramiteRecibidoAtendidoDto.CodigoReferenciaDoc,
              Asunto: createTramiteRecibidoAtendidoDto.Asunto,
              Observaciones: createTramiteRecibidoAtendidoDto.Observaciones,
              Folios: createTramiteRecibidoAtendidoDto.Folios,
              IdTipoDocumento: createTramiteRecibidoAtendidoDto.IdTipoDocumento,
              IdEstado: 4,// IdEstado - Adjuntado - 4
              ModificadoEl: new Date().toISOString(),
              ModificadoPor: `${request?.user?.id ?? 'test user'}`,
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

          digitalFiles.push({ IdFM: responseDigitalFiles.IdDocumento })
        }
        //b1---------------------------------------


        //b2 we create the HxE
        const dataHxE = await prisma.historialMovimientoxEstado.create({
          data: {
            IdEstado: 18, // IdEstado - Atendido - 18
            IdMovimiento: createTramiteRecibidoAtendidoDto.IdMovimiento,
            Observaciones: createTramiteRecibidoAtendidoDto.Observaciones,
            FechaHistorialMxE: new Date().toISOString(),
            Activo: true,
            IdDocumento: digitalFiles[0]?.IdFM || null,
            CreadoEl: new Date().toISOString(),
            CreadoPor: `${request?.user?.id ?? 'test user'}`,
          },
          select: {
            IdHistorialMxE: true,
            FechaHistorialMxE: true,
            IdDocumento: true,
            Estado: {
              select: {
                IdEstado: true,
                Descripcion: true
              }
            },
            Movimiento: {
              select: {
                IdMovimiento: true
              }
            }
          }
        })

        if (dataHxE) {

        } else {
          const customError = new Error('Error en crear los HxE')
          customError.name = 'FAILD_TRAMITE_EMITIDO'
          throw customError
        }
        //b2---------------------------------------

        if (anexos.length > 0) {
          //b3-we update the digital files
          anexos = anexos.map((anexo) => {
            return {
              Titulo: anexo.Titulo,
              FormatoAnexo: anexo.FormatoAnexo,
              NombreAnexo: anexo.NombreAnexo,
              UrlAnexo: anexo.UrlAnexo,
              SizeAnexo: anexo.SizeAnexo,
              UrlBase: anexo.UrlBase,
              IdDocumento: digitalFiles[0]?.IdFM,
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
        }

        return {
          DataHxE: dataHxE,
          DigitalFiles: responseDigitalFiles || null,
          Anexos: responseAnexos
        }
      })
      // else {
      //   const customError = new Error('Error al crear el trámite emitido')
      //     customError.name = 'FAILD_TRAMITE_EMITIDO'
      //     throw customError
      // }


      if (result?.DataHxE?.IdHistorialMxE) {
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

  async desmarcarAtender(desmarcarAtenderTramiteDto: DesmarcarAtenderTramiteDto): Promise<any> {
    try {

      const result = await this.prisma.$transaction(async (prisma) => {
        const hMxEFound = await prisma.historialMovimientoxEstado.findFirst({
          where: {
            Movimiento: {
              IdMovimiento: desmarcarAtenderTramiteDto.IdMovimiento
            }, Estado: {
              IdEstado: 18  // IdEstado - Atendido - 18
            }
          },
          select: {
            IdHistorialMxE: true
          }
        })

        if (!hMxEFound) {
          throw Error('Este movimiento no tiene estado archivado');
        }

        const hMxE = await prisma.historialMovimientoxEstado.delete({
          where: {
            IdHistorialMxE: hMxEFound.IdHistorialMxE
          },
          select: {
            IdHistorialMxE: true,
            FechaHistorialMxE: true,
            IdDocumento: true,
            Documento: {
              select: {
                Anexo: {
                  select: {
                    IdAnexo: true,
                    UrlAnexo: true
                  }
                }
              }
            },
            Estado: {
              select: {
                IdEstado: true,
                Descripcion: true,
              }
            },
            Movimiento: {
              select: {
                IdMovimiento: true
              }
            }
          }
        })

        if (!hMxE) {
          throw Error('Error al eliminar Historial Movimiento x Estado');
        }

        printLog(hMxE);
        if (hMxE.IdDocumento != null) {

          if (hMxE.Documento.Anexo.length > 0) {
            const anexos = await prisma.anexo.deleteMany({
              where: {
                IdDocumento: hMxE.IdDocumento
              },
            })

            if (anexos.count != hMxE.Documento.Anexo.length) {
              throw Error('Error al eliminar anexos');
            }
          }

          const documento = await prisma.documento.delete({
            where: {
              IdDocumento: hMxE.IdDocumento
            },
            select: {
              IdDocumento: true,
              UrlDocumento: true
            }
          })

          if (!documento) {
            throw Error('Error al eliminar el documento');
          }

          if (hMxE.Documento.Anexo.length > 0) {
            hMxE.Documento.Anexo.map(async (anexo) => {
              await this.file.remove({ PublicUrl: anexo.UrlAnexo });
            })
          }

          await this.file.remove({ PublicUrl: documento.UrlDocumento });
        }

        return { hMxE: hMxE };
      })

      if (result.hMxE?.IdHistorialMxE) {
        this.message.setMessage(0, 'Trámite - Registro(s) recibido(s)');
        return {
          message: this.message, registro: {
            IdHistorialMxE: result.hMxE.IdHistorialMxE,
            FechaHistorialMxE: result.hMxE.FechaHistorialMxE,
            IdDocumento: result.hMxE.IdDocumento,
            Estado: result.hMxE.Estado,
            Movimiento: result.hMxE.Movimiento,
          }
        };
      } else {
        this.message.setMessage(1, 'Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async observar(observarTramiteDto: ObservarTramiteDto, @Req() request?: Request): Promise<any> {
    try {

      let movimientos: HistoriaLMxEDto[] = observarTramiteDto.Movimientos;

      const result = await this.prisma.$transaction(async (prisma) => {

        //b3
        movimientos = movimientos.map((movimiento) => {
          return {
            IdEstado: 20, // IdEstado - Observado - 20
            IdMovimiento: movimiento.IdMovimiento,
            Observaciones: observarTramiteDto.Observaciones,
            FechaHistorialMxE: new Date().toISOString(),
            Activo: true,
            CreadoEl: new Date().toISOString(),
            CreadoPor: `${request?.user?.id ?? 'test user'}`,
          }
        })

        const responseMovimientos = await Promise.all(
          movimientos?.map(async (movimiento: HistoriaLMxEDto) => {
            const dataHxE = await prisma.historialMovimientoxEstado.create({
              data: movimiento,
              select: {
                IdHistorialMxE: true,
                FechaHistorialMxE: true,
                IdDocumento: true,
                Estado: {
                  select: {
                    IdEstado: true,
                    Descripcion: true
                  }
                },
                Movimiento: {
                  select: {
                    IdMovimiento: true
                  }
                }
              }
            })

            if (dataHxE) {
              return {
                success: true,
                data: dataHxE,
              }
            } else {
              return {
                success: false,
                error: "Error en crear HxE",
              };
            }
          })
        )

        const failedResponseMovimientos = responseMovimientos.filter((r) => !r.success);

        if (failedResponseMovimientos.length > 0) {
          const customError = new Error('Error en crear los HxE')
          customError.name = 'FAILD_TRAMITE_EMITIDO'
          throw customError
        }
        //b3---------------------------------------

        return {
          Movimientos: responseMovimientos.map((r) => r.data)
        }
      })

      if (result?.Movimientos.length > 0) {
        this.message.setMessage(0, 'Trámite - Registro(s) recibido(s)');
        return { message: this.message, registro: result.Movimientos };
      } else {
        this.message.setMessage(1, 'Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async desmarcarObservar(desmarcarObservarTramiteDto: DesmarcarObservarTramiteDto): Promise<any> {
    try {

      const hMxEFound = await this.prisma.historialMovimientoxEstado.findFirst({
        where: {
          Movimiento: {
            IdMovimiento: desmarcarObservarTramiteDto.IdMovimiento
          }, Estado: {
            IdEstado: 20  // IdEstado - Observado - 20
          }
        },
        select: {
          IdHistorialMxE: true
        }
      })

      if (!hMxEFound) {
        this.message.setMessage(1, 'Este movimiento no tiene estado observado');
        return { message: this.message };
      }

      const hMxE = await this.prisma.historialMovimientoxEstado.delete({
        where: {
          IdHistorialMxE: hMxEFound.IdHistorialMxE
        },
        select: {
          IdHistorialMxE: true,
          FechaHistorialMxE: true,
          IdDocumento: true,
          Estado: {
            select: {
              IdEstado: true,
              Descripcion: true,
            }
          },
          Movimiento: {
            select: {
              IdMovimiento: true
            }
          }
        }
      })

      if (hMxE) {
        this.message.setMessage(0, 'Trámite - Registro(s) recibido(s)');
        return { message: this.message, registro: hMxE };
      } else {
        this.message.setMessage(1, 'Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async archivar(archivarTramiteDto: ArchivarTramiteDto, @Req() request?: Request): Promise<any> {
    try {

      let movimientos: HistoriaLMxEDto1[] = archivarTramiteDto.Movimientos;

      const result = await this.prisma.$transaction(async (prisma) => {

        //b3
        movimientos = movimientos.map((movimiento) => {
          return {
            IdTramite: movimiento.IdTramite,
            IdEstado: 19, // IdEstado - Archivado - 19
            IdMovimiento: movimiento.IdMovimiento,
            Detalle: archivarTramiteDto.Detalle,
            FechaHistorialMxE: new Date().toISOString(),
            Activo: true,
            CreadoEl: new Date().toISOString(),
            CreadoPor: `${request?.user?.id ?? 'test user'}`,
          }
        })

        const responseMovimientos = await Promise.all(
          movimientos?.map(async (movimiento: HistoriaLMxEDto1) => {

            const idTramite = movimiento.IdTramite

            delete movimiento.IdTramite

            const dataHxE = await prisma.historialMovimientoxEstado.create({
              data: movimiento,
              select: {
                IdHistorialMxE: true,
                FechaHistorialMxE: true,
                IdDocumento: true,
                Estado: {
                  select: {
                    IdEstado: true,
                    Descripcion: true
                  }
                },
                Movimiento: {
                  select: {
                    IdMovimiento: true
                  }
                }
              }
            })

            const dataTramite = await prisma.tramite.update({
              where: {
                IdTramite: idTramite
              },
              data: {
                IdArchivador: archivarTramiteDto.IdArchivador,
                ModificadoEl: new Date().toISOString(),
                ModificadoPor: `${request?.user?.id ?? 'test user'}`,
              },
              select: {
                IdTramite: true
              }
            })

            const dataArchivador = await prisma.archivador.update({
              where: {
                IdArchivador: archivarTramiteDto.IdArchivador
              },
              data: {
                NroTramites: {
                  increment: 1
                },
                ModificadoEl: new Date().toISOString(),
                ModificadoPor: `${request?.user?.id ?? 'test user'}`
              },
              select: {
                IdArchivador: true
              }
            })

            if (dataHxE && dataTramite && dataArchivador) {
              return {
                success: true,
                data: dataHxE,
              }
            } else {
              return {
                success: false,
                error: "Error en crear HxE o actualizar trámite",
              };
            }
          })
        )

        const failedResponseMovimientos = responseMovimientos.filter((r) => !r.success);

        if (failedResponseMovimientos.length > 0) {
          const customError = new Error('Error en crear los HxE')
          customError.name = 'FAILD_TRAMITE_EMITIDO'
          throw customError
        }
        //b3---------------------------------------

        return {
          Movimientos: responseMovimientos.map((r) => r.data)
        }
      })

      if (result?.Movimientos.length > 0) {
        this.message.setMessage(0, 'Trámite - Registro(s) recibido(s)');
        return { message: this.message, registro: result.Movimientos };
      } else {
        this.message.setMessage(1, 'Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
      console.log(error);
      this.message.setMessage(1, error.message);
      return { message: this.message };
    }
  }

  async desmarcarArchivar(
    desmarcarArchivarTramiteDto: DesmarcarArchivarTramiteDto,
    request?: Request,
  ): Promise<any> {
    try {

      const result = await this.prisma.$transaction(async (prisma) => {

        const hMxEFound = await prisma.historialMovimientoxEstado.findFirst({
          where: {
            Movimiento: {
              IdMovimiento: desmarcarArchivarTramiteDto.IdMovimiento
            }, Estado: {
              IdEstado: 19  // IdEstado - Archivado - 19
            }
          },
          select: {
            IdHistorialMxE: true,
            FechaHistorialMxE: true,
            IdDocumento: true,
            Movimiento: {
              select: {
                IdTramite: true,
                Tramite: {
                  select: {
                    IdArchivador: true,
                  }
                }
              }
            }
          }
        })

        if (!hMxEFound) {
          throw Error('Este movimiento no tiene estado archivado');
        }

        const hMxE = await prisma.historialMovimientoxEstado.delete({
          where: {
            IdHistorialMxE: hMxEFound.IdHistorialMxE
          },
          select: {
            IdHistorialMxE: true,
            FechaHistorialMxE: true,
            IdDocumento: true,
            Estado: {
              select: {
                IdEstado: true,
                Descripcion: true,
              }
            },
            Movimiento: {
              select: {
                IdMovimiento: true,
              }
            },
          }
        })

        if (!hMxE) {
          throw Error('Error al eliminar HxE');
        }

        const dataArchivador = await prisma.archivador.update({
          where: {
            IdArchivador: hMxEFound.Movimiento.Tramite.IdArchivador
          },
          data: {
            NroTramites: {
              decrement: 1
            },
            ModificadoEl: new Date().toISOString(),
            ModificadoPor: `${request?.user?.id ?? 'test user'}`
          },
          select: {
            IdArchivador: true
          }
        })

        if (!dataArchivador) {
          throw Error('Error actuaslizar el archivador');
        }

        const dataTramite = await prisma.tramite.update({
          where: {
            IdTramite: hMxEFound.Movimiento.IdTramite
          },
          data: {
            IdArchivador: null,
            ModificadoEl: new Date().toISOString(),
            ModificadoPor: `${request?.user?.id ?? 'test user'}`,
          }
        })

        if (!dataTramite) {
          throw Error('Error en actualizar trámite');
        }
        return {
          hMxE,
          dataTramite,
        }
      })

      if (result.dataTramite && result.hMxE) {
        this.message.setMessage(0, 'Trámite - Registro(s) recibido(s)');
        return { message: this.message, registro: result.hMxE };
      } else {
        this.message.setMessage(1, 'Error interno en el servidor');
        return { message: this.message };
      }
    } catch (error: any) {
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
        orderBy: {
          FechaInicio: 'desc',
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
          IdMovimiento: true,
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
          Acciones: true,
          FechaMovimiento: true,
          NombreResponsable: true,//destinatario
          FirmaDigital: true,
          Copia: true,

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
          HistorialMovimientoxEstado: {
            select: {
              IdHistorialMxE: true,
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
        },
        orderBy: {
          FechaMovimiento: 'desc',
        },
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

  async findAllRecibidos(getAllTramiteRecibidoDto: GetAllTramiteRecibidoDto): Promise<OutTramitesRecibidoDto> {
    try {

      const tramites = await this.prisma.movimiento.findMany({
        where: {
          AND: [
            {
              HistorialMovimientoxEstado: {
                some: {
                  Estado: {
                    IdEstado: 15
                  }
                }
              }
            },
            {
              HistorialMovimientoxEstado: {
                some: {
                  Estado: {
                    IdEstado: {
                      in: [16, 17, 18, 19, 20]
                    }
                  }
                }
              }
            },
          ],
          IdAreaDestino: getAllTramiteRecibidoDto.IdAreaDestino,
        },
        select: {
          IdMovimiento: true,
          FirmaDigital: true,
          Copia: true,
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
              UrlDocumento: true,
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
        orderBy: {
          FechaMovimiento: 'desc',
        },
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
