import { ApiResponseModel } from "../general/ApiModel";

export type RestartPassModel = {
  cUsuario: string;
  cPass: string;
  cPassAnterior: string;
  lCurrent: boolean;
};

export type RestorePassModels = {
  header: ApiResponseModel;
  body: RestorePassResponse;
};

export type RestorePassResponse = {
  usuario: string;
};
