import { ApiResponseModel } from "../general/ApiModel";

export type PagosNPModels = {
  header: ApiResponseModel;
  body: PagosNPResponseModels[];
};

export type PagosNPResponseModels = {
  cOperacionEmpresa: string;
  idCanal: number;
  cCanal: string;
  idCuenta: number;
  cTipoOperacion: string;
  nMontoOperacion: number;
  dFechaHoraRegistro: string;
  nIntentoPago: string;
  cEstado: string;
};
