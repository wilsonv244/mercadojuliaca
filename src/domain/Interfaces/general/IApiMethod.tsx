import { ApiResponseModel } from "@/domain/models/general/ApiModel";

export interface IApiMethod {
  GetRequestMethod: (url: string, token: string) => Promise<ApiResponseModel>;
  PostRequestMethod: (
    url: string,
    body: string,
    token: string
  ) => Promise<ApiResponseModel>;
}

export type HttpResponse<T = any> = {
  statusCode: HttpStatusCode;
  body?: T;
  description: string;
};

export enum HttpStatusCode {
  ok = 200,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  serverError = 500,
}

export interface IFechtMethod {
  getMethod: (url: string, token: string) => Promise<HttpResponse>;
  postMethodXml: (
    urlMethod: string,
    token?: string,
    bodyRequest?: string
  ) => Promise<HttpResponse>;
  postMethod: (
    urlMethod: string,
    token?: string,
    body?: string
  ) => Promise<HttpResponse>;
  putMethod: (
    urlMethod: string,
    token: string,
    body: string
  ) => Promise<HttpResponse>;
}
