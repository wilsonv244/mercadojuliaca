import { ApiResponseModel } from "../general/ApiModel";

export type MethodPay = {
  idCanal: string;
  cCanal: string;
};

export type MethodPayResponse = {
  header: ApiResponseModel;
  body: MethodPay[];
};
