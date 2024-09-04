import { ApiResponseModel } from "../general/ApiModel";

export type PagosPModels = {
  header: ApiResponseModel;
  body: PagosPResponseModels[];
};
export type PagosPResponseModels = {
  idRegistro: string;
  cOperacionEmpresa: string;
  idCanal: number;
  cCanal: string;
  idCuenta: number;
  cTipoOperacion: string;
  nBalance: number;
  nMontoOperacion: number;
  dFechaHoraRegistro: string | Date;
  arrKardex: arrKarkexModel[];
};
export type arrKarkexModel = {
  idCuenta: number;
  idKardex: number;
  nMonto: number;
  lEstado: boolean;
  idTipoOperacion: number;
  cNombreCli: string;
};

export interface PropsPagosNP {
  detallePago: PagosPResponseModels | any;
  setUpdate: any;
  update: number;
}

export interface PagosProcesadosTable {
  idRegistro: string;
  cOperacionEmpresa: string;
  idCanal: number;
  cCanal: string;
  idCuenta: number;
  cTipoOperacion: string;
  nBalance: number;
  nMontoOperacion: number;
  dFechaHoraRegistro: string | Date;
  idKardex: number;
  cNombreCli: string;
}
