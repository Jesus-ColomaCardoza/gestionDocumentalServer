import 'express';

declare module 'express' {
  export interface Request {
    user?: any; // Define aquí la estructura del usuario si tienes un tipo específico
  }
}
