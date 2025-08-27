/**
 * console.log() custom
 *
 * @param {any[]} args
 */
export const printLog = (...args: any[]) => {
  const stack = new Error().stack?.split('\n')[2]; // Captura la línea de la llamada
  const match = stack?.match(/\((.*):(\d+):\d+\)/); // Extrae archivo y número de línea
  if (match) {
    const file = match[1].split('/').pop(); // Nombre del archivo    
    const line = match[2]; // Número de línea
    console.log('+' + `-`.repeat(100) + '+');
    console.log(`\x1b[36;4m[${file.split('\\')[file.split('\\').length - 1]}:${line}]\x1b[0m ⬇ To access ctrl + click ⬇`);
    console.log(...args);
    console.log('+' + `-`.repeat(100) + '+');
  } else {
    console.log('[No Info]', ...args);
  }
};

/*
\x1b[4m → Subrayado
\x1b[30m → Negro
\x1b[31m → Rojo
\x1b[32m → Verde
\x1b[33m → Amarillo
\x1b[34m → Azul
\x1b[35m → Magenta
\x1b[36m → Cian
\x1b[37m → Blanco
\x1b[0m → Reset (restablece el color)
*/



const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}