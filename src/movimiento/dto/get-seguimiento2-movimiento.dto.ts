import { IsInt, IsNotEmpty } from 'class-validator';

export class GetSeguimiento2MovimientoDto {
  @IsInt()
  @IsNotEmpty()
  IdTramite: number;
}
