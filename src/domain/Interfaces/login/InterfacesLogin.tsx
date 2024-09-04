import { ApiResponseModel } from "@/domain/models/general/ApiModel";

export interface ILoginResponse {
  cUsuario: string;
  cPass: string;
}
export interface ILoginResponseData {
  header: ApiResponseModel;
  body?: IloginBody;
}
export interface ICPLatamLoginResponseData {
  header: ApiResponseModel;
  body?: IloginCPLatam;
}

export type IloginBody = {
  nExpire: number;
  cToken: string;
  cRefreshToken: string;
};

export type IloginCPLatam = {
  arrProfile: [];
  cRefreshToken: string;
  cToken: string;
  nExpireIn: number;
  userName: string;
};
