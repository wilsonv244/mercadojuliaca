import { ApiResponseModel } from "../general/ApiModel";
import { responseCatalog } from "./uCatalogModels";

export type consultCatalog = {
  header: ApiResponseModel;
  body: responseCatalog[];
};

export type saveCatalogueRequest = {
  idCodigo: number;
  cRespuesta: string;
  lStatus: boolean;
};
