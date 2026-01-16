import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/connection/prisma.service';
import { Menssage } from 'src/menssage/menssage.entity';
import { FiltersService } from 'src/filters/filters.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { BuscarDniDto } from './dto/buscar-dni.dto';
import { BuscarRucDto } from './dto/buscar-ruc.dto';
import { printLog } from 'src/utils/utils';

@Injectable()
export class ReniecService {
  private message = new Menssage();

  constructor(
    private prisma: PrismaService,
    private configEnv: ConfigService,
  ) { }

  async buscarDni(buscarDniDto: BuscarDniDto) {
    try {
      const dni = buscarDniDto.Dni || false;

      if (dni) {
        const usuario = await this.prisma.usuario.findFirst({
          where: { NroIdentificacion: dni,IdTipoIdentificacion: 1 },
          select: {
            Nombres: true,
            ApellidoPaterno: true,
            ApellidoMaterno: true,
            NroIdentificacion: true,
            TipoIdentificacion: {
              select: {
                IdTipoIdentificacion: true,
                Descripcion: true,
              }
            }
          },
        });

        if (usuario) {
          this.message.setMessage(0, 'DNI encontrado en base de datos');
          return {
            message: this.message,
            registro: {
              first_name: usuario.Nombres ?? '',
              first_last_name: usuario.ApellidoPaterno ?? '',
              second_last_name: usuario.ApellidoMaterno ?? '',
              document_number: usuario.NroIdentificacion ?? '',
              full_name:
                `${usuario.ApellidoPaterno ?? ''} ${usuario.ApellidoMaterno ?? ''} ${usuario.Nombres ?? ''}`.trim(),
              origen: 'api'
            },
          };
        }
      }

      const url = `${this.configEnv.get('config.reniecUrl')}/reniec/dni?numero=${dni}`

      const response = await axios(url, {
        headers: {
          Authorization: `Bearer ${this.configEnv.get('config.reniecKey')}`,
        },
      });

      if (response.status === 404) {
        this.message.setMessage(
          2,
          'El DNI no existe en RENIEC'
        );

        return { message: this.message };
      }

      if (!response.data) {
        this.message.setMessage(2, 'DNI no encontrado en RENIEC');

        return { message: this.message };
      }

      this.message.setMessage(0, 'DNI encontrado en RENIEC');

      return {
        message: this.message,
        registro: { ...response.data, origen: 'reniec' },
      };
    } catch (error: any) {
      printLog(error);
      // this.message.setMessage(1, error.message);
      this.message.setMessage(1, 'DNI no encontrado en RENIEC');
      return { message: this.message };
    }
  }

  async buscarRuc(buscarRucDto: BuscarRucDto) {
    try {
      const ruc = buscarRucDto.Ruc || false;

      if (ruc) {
        const empresa = await this.prisma.usuario.findFirst({
          where: { NroIdentificacion: ruc ,IdTipoIdentificacion: 2 },
          select: {
            RazonSocial: true,
            NroIdentificacion: true,
            TipoIdentificacion: {
              select: {
                IdTipoIdentificacion: true,
                Descripcion: true,
              }
            }
          },
        });

        if (empresa) {
          this.message.setMessage(0, 'RUC encontrado en base de datos');
          return {
            message: this.message,
            registro: {
              razon_social: empresa.RazonSocial ?? '',
              numero_documento: empresa.NroIdentificacion ?? '',
              origin: 'api'
            },
          };
        }
      }

      const url = `${this.configEnv.get('config.reniecUrl')}/sunat/ruc?numero=${ruc}`;

      const response = await axios(url, {
        headers: {
          Authorization: `Bearer ${this.configEnv.get('config.reniecKey')}`,
        },
      });

      if (response.status === 404) {
        this.message.setMessage(2, 'El RUC no existe en SUNAT');

        return { message: this.message };
      }

      if (!response.data) {
        this.message.setMessage(2, 'RUC no encontrado en SUNAT');

        return { message: this.message };
      }

      this.message.setMessage(0, 'RUC encontrado en SUNAT');

      return {
        message: this.message,
        registro: {
          razon_social: response.data.razon_social ?? '',
          numero_documento: response.data.numero_documento ?? '',
          origen: 'reniec'
        },
      };
    } catch (error: any) {
      printLog(error);
      // this.message.setMessage(1, error.message);
      this.message.setMessage(1, 'RUC no encontrado en SUNAT');
      return { message: this.message };
    }
  }
}
