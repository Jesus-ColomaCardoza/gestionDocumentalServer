import { IsInt, IsNotEmpty } from 'class-validator';

export class GetSeguimientoMovimientoDto {
  @IsInt()
  @IsNotEmpty()
  IdTramite: number;

  @IsInt()
  @IsNotEmpty()
  IdMovimiento: number;
}
