import { ApiResponseModel } from "../general/ApiModel";

export type responseCatalog = {
  idUsuario: number;
  cRespuesta: string;
  lEstado: boolean;
  dFechaRegistro: string;
};

export type CatalogResponse = {
  header: ApiResponseModel;
  body: responseCatalog | null;
};

export type SingleUCatModel = {
  IdWorkOrderFormType: string;
  IdWorkOrder: string;
  ExternalId: string;
  Action: string;
  InputFields: InputFiledsModel;
  Username: string;
  WorkOrderType: string;
};

export type InputFiledsModel = {
  usuario: string;
};

export type SaveCatalogueResponse = {
  header: ApiResponseModel;
};
