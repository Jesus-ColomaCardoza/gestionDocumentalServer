import { IsInt, IsNotEmpty } from "class-validator";

export class GetAllTramitePendienteDto {
    @IsInt()
    @IsNotEmpty()
    IdAreaDestino: number;
}
