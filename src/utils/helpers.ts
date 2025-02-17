import { format, parseISO, add } from 'date-fns';
import moment from 'moment-timezone';

export class Helpers {
  /**
   * Generate Id.
   *
   * @param {number} initialLimit
   * @param {string} idEntity
   * @param {any} entityArray
   * @param {string} idEntityDependency
   * @returns {string} return a generated id.
   */
  generateId(
    initialLimit: number,
    idEntity: string,
    entityArray: any,
    idEntityDependency: string,
  ): string {
    const idsEntityArray = entityArray.registro.map((id: any) => id[idEntity]);

    let idFragmet: number = initialLimit + idsEntityArray.length;
    let idTemp: string = idEntityDependency + idFragmet.toString();

    while (idsEntityArray.includes(idTemp)) {
      idFragmet = idFragmet + 1;
      idTemp = idEntityDependency + idFragmet.toString();
    }

    idTemp = idEntityDependency + idFragmet;

    return idTemp;
  }

  /**
   * Format Date.
   *
   * @param {string} dateString
   * @returns {string} return formatted date.
   */
  formatDate(dateString: string, onlyDate?: boolean): string {
    let dateFormat = parseISO(dateString);

    // const zonedDate = toZonedTime(dateFormat, 'America/Lima');
    const tempDate = add(dateFormat, { hours: 6 });

    const hours = format(tempDate, 'hh:mm a');
    const date = format(tempDate, 'dd/MM/yyyy');

    return date + (onlyDate ? '' : ' ' + hours);
  }

  /**
   * expire Date.
   *
   * @param {number} timeToAdd
   * @param {string} typeTimeToAdd
   * @returns { expireDateISO: Date; expireDateString: string; }
   */
  expireDate(
    timeToAdd: number,
    typeTimeToAdd: 'minutes' | 'hours' | 'days',
  ): { expireDateISO: Date; expireDateString: string; timeFormat: string } {
    let dateFormat = Date.now();
    let time = {};

    time[typeTimeToAdd] = timeToAdd;

    // const zonedDate = toZonedTime(dateFormat, 'America/Lima');

    const tempDate = add(dateFormat, time);

    const hours = format(tempDate, 'hh:mm:s a');
    const date = format(tempDate, 'dd/MM/yyyy');

    const timeFormat = `${timeToAdd + typeTimeToAdd.charAt(0)}`;

    return {
      expireDateISO: tempDate,
      expireDateString: date + ' ' + hours,
      timeFormat: timeFormat,
    };
  }

  /**
   * expire Date2.
   *
   * @param {number} expire
   * @returns { time: string; }
   */
  expireDate2(expire: number): string {
    const expirationDate = moment.unix(expire).tz('America/Lima');

    const formattedExpiration = expirationDate.format('DD/MM/YYYY HH:mm:ss');

    const time = formattedExpiration.replace(',', '');

    return time;
  }

  /**
   * remove the keys of a Object.
   *
   * @param { Record<string, any>} object
   * @param { string []} keysToKeep
   * @returns { Record<string, any>}
   */
  removeObjectKeys(
    object: Record<string, any>,
    keysToKeep: string[],
  ): Record<string, any> {
    const allKeys = Object.keys(object);

    const allKeysToKeep = allKeys.filter((key) => keysToKeep.includes(key));

    const allKeysToKeepResponse = allKeysToKeep.reduce((filteredObj, key) => {
      filteredObj[key] = object[key];
      return filteredObj;
    }, {});

    return allKeysToKeepResponse;
  }

  /**
   * generate  tree
   *
   * @param { any[]} nodos
   * @param { number | null} parentId
   * @returns { any[]}
   */
  generateAccesosTree(nodos: any[], parentId: number | null): any[] {
    return (
      nodos
        // filter child nodes of the parent node
        .filter(
          (nodo) =>
            (nodo.accesoPadre?.IdAcceso ?? null) === parentId,
        )
        // recursively finds its children
        .map((nodo) => ({
          ...nodo,
          accesohijo: this.generateAccesosTree(
            nodos,
            nodo.IdAcceso,
          ),
        }))
    );
  }

  generateMenuTree(nodos: any[], parentId: number | null): any[] {
    return (
      nodos
        // filter child nodes of the parent node
        .filter(
          (nodo) =>
            (nodo.menupadre?.IdMenu ?? null) === parentId,
        )
        // recursively finds its children
        .map((nodo) => ({
          ...nodo,
          menuhijo: this.generateMenuTree(
            nodos,
            nodo.IdMenu,
          ),
        }))
    );
  }

  /**
   * print  tree
   *
   * @param { any[]} arbol
   * @param { number | null} nivel
   */
  printAccesosTree(arbol: any[], nivel: number = 0): void {
    // RECORRER EL ARBOL
    // add component parent
    const sangria = '  '.repeat(nivel); // Genera espacios para simular niveles de jerarquía

    arbol.forEach((nodo) => {
      // add component children
      console.log(
        `${sangria}- Nodo ID: ${nodo.IdAcceso}, Nombre: ${nodo.Descripcion}`,
      );

      if (nodo.accesohijo && nodo.accesohijo.length > 0) {
        this.printAccesosTree(nodo.accesohijo, nivel + 1); // Llamada recursiva con un nivel más
      }
    });
  }

  printMenuTree(arbol: any[], nivel: number = 0): void {
    // RECORRER EL ARBOL
    // add component parent
    const sangria = '  '.repeat(nivel); // Genera espacios para simular niveles de jerarquía

    arbol.forEach((nodo) => {
      // add component children
      console.log(
        `${sangria}- Nodo ID: ${nodo.IdMenu}, Nombre: ${nodo.Descripcion}`,
      );

      if (nodo.menuhijo && nodo.menuhijo.length > 0) {
        this.printMenuTree(nodo.menuhijo, nivel + 1); // Llamada recursiva con un nivel más
      }
    });
  }

  /**
   * iterate  tree
   *
   * @param { any[]} arbol
   * @param { number | null} nivel
   */
  iterateAccesosTree(arbol: any[], nivel: number = 0): void {
    arbol.forEach((nodo) => {
      delete nodo.moduloaplicativo;

      if (nodo.accesohijo && nodo.accesohijo.length > 0) {
        this.iterateAccesosTree(nodo.accesohijo, nivel + 1);
      }
    });
  }
}
