import { Injectable } from '@nestjs/common';
import {
  CreateFilterDto,
  FilterOperator,
  FilterType,
} from './dto/create-filter.dto';

export class FiltersService {
  ltsFilters: CreateFilterDto[] = [];
  campo: string;
  operador: FilterOperator;
  valor1: string;
  valor2?: string;
  tipo: FilterType;

  constructor(
    campo?: string,
    tipo?: FilterType,
    operador?: FilterOperator,
    valor1?: string,
    valor2?: string,
  ) {
    this.campo = campo || '';
    this.tipo = tipo || 'other';
    this.operador = operador || 'EQ';
    this.valor1 = valor1 || '';
    this.valor2 = valor2 || '';

    if (
      !['numeric2', 'comboPlataforma', 'date', 'boolean'].includes(this.tipo)
    ) {
      this.valor1 = `"${valor1}"`;
      this.valor2 = valor2 ? `"${valor2}"` : '';
    }
  }

  getCadena(): any {
    let clausula: any = {};

    switch (this.tipo) {
      case 'date':
        const lv_inicio = new Date(this.valor1);
        let lv_fin = this.valor2 ? new Date(this.valor2) : null;

        switch (this.operador) {
          case 'EQ':
            let d_inicio = new Date(this.valor1);
            let d_fin = new Date(this.valor1);
            d_fin.setUTCHours(23, 59, 59, 0);

            clausula[this.campo] = {
              gte: d_inicio,
              lte: d_fin,
            };
            break;
          case 'BT':
            let d_finn = new Date(this.valor2);
            d_finn.setUTCHours(23, 59, 59, 0);

            clausula[this.campo] = {
              gte: lv_inicio,
              lte: d_finn,
            };
            break;
          case 'GT':
            clausula[this.campo] = { gt: lv_inicio };
            break;
          case 'LT':
            clausula[this.campo] = { lt: lv_inicio };
            break;
          case 'GE':
            clausula[this.campo] = { gte: lv_inicio };
            break;
          case 'LE':
            clausula[this.campo] = { lte: lv_inicio };
            break;
        }
        break;

      case 'numeric2':
        switch (this.operador) {
          case 'EQ':
            clausula[this.campo] = Number(this.valor1);
            break;
          case 'BT':
            clausula[this.campo] = {
              gte: Number(this.valor1),
              lte: Number(this.valor2),
            };
            break;
          case 'GT':
            clausula[this.campo] = { gt: Number(this.valor1) };
            break;
          case 'LT':
            clausula[this.campo] = { lt: Number(this.valor1) };
            break;
          case 'GE':
            clausula[this.campo] = { gte: Number(this.valor1) };
            break;
          case 'LE':
            clausula[this.campo] = { lte: Number(this.valor1) };
          case 'IN':
            const array = this.valor1.split(',');
            const arrayNumber = array.map((a) => parseInt(a));
            clausula[this.campo] = { in: arrayNumber };
            break;
        }
        break;

      case 'string':
        if (this.operador === 'EQ') {
          clausula[this.campo] = this.valor1.replace(/"/g, '');
        } else if (this.operador === 'Contains') {
          clausula[this.campo] = { contains: this.valor1.replace(/"/g, '') };
        } else if (this.operador === 'IN') {
          const array = this.valor1
            .substring(1, this.valor1.length - 1)
            .split(',');
          const arrayString = array.map((a) => a);
          clausula[this.campo] = { in: arrayString };
        }
        break;

      case 'boolean':
        // Manejo de tipo booleano
        clausula[this.campo] =
          this.operador === 'EQ'
            ? this.valor1 === 'true'
            : !(this.valor1 === 'true');
        break;

      case 'comboPlataforma':
      case 'other':
        if (this.operador === 'EQ') {
          clausula[this.campo] = this.valor1.replace(/"/g, '') || null;
        } else {
          clausula[this.campo] = {
            [this.operador.toLowerCase()]: this.valor1.replace(/"/g, ''),
          };
        }
        break;

      default:
        break;
    }

    return clausula;
  }

  fabricarClausula(filtros: CreateFilterDto[]): any {
    this.ltsFilters = filtros;
    let dict: { [key: string]: any[] } = {};

    filtros.forEach((filtro) => {
      if (filtro.valor1) {
        let cadena = new FiltersService(
          filtro.campo,
          filtro.tipo,
          filtro.operador,
          filtro.valor1,
          filtro.valor2,
        ).getCadena();

        if (dict[filtro.campo]) {
          dict[filtro.campo].push(cadena);
        } else {
          dict[filtro.campo] = [cadena];
        }
      }
    });

    let andConditions = Object.values(dict).map((conditions) => ({
      OR: conditions,
    }));

    return { AND: andConditions };
  }
}
