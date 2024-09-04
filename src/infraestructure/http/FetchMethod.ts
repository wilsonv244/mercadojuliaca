import {
  HttpResponse,
  HttpStatusCode,
  IFechtMethod,
} from "@/domain/Interfaces/general/IApiMethod";
import { xml2js } from "xml-js";

export class FechtMethod implements IFechtMethod {
  async postMethod(
    urlMethod: string,
    token: string | null = null,
    bodyRequest: any
  ): Promise<HttpResponse> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token !== null) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response: Response = await fetch(urlMethod, {
        method: "POST",
        headers: headers,
        body: bodyRequest,
      });
      console.log(response.status);
      const responseBody =
        response.status === 204 ? null : await response.json();
      console.log(responseBody);
      return {
        statusCode: response.status,
        body: responseBody,
        description: response.statusText,
      };
    } catch (error) {
      return {
        statusCode: HttpStatusCode.serverError,
        body: error,
        description: "Internal Server Error",
      };
    }
  }
  async postMethodXml(
    urlMethod: string,
    token: string | undefined | null = null,
    body: string = ""
  ): Promise<HttpResponse> {
    try {
      let response: Response;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token !== null) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      response = await fetch(urlMethod, {
        headers: headers,
        body: body,
        method: "POST",
      });

      const xml = await response.text();

      return {
        statusCode: response.status,
        body: xml,
        description: response.statusText,
      };
    } catch (error) {
      return {
        statusCode: HttpStatusCode.serverError,
        body: error,
        description: "Internal Server Error",
      };
    }
  }

  async getMethod(
    url: string,
    token: string | null = null
  ): Promise<HttpResponse> {
    try {
      let responseApi: Response;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token !== null) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      responseApi = await fetch(url, {
        method: "GET",
        headers: headers,
      });
      return {
        statusCode: responseApi.status,
        body: await responseApi.json(),
        description: responseApi.statusText,
      };
    } catch (error: unknown) {
      return {
        statusCode: HttpStatusCode.serverError,
        body: error,
        description: "Internal Server Error",
      };
    }
  }
  async putMethod(
    urlMethod: string,
    token: string,
    body: string
  ): Promise<HttpResponse> {
    let response: Response;
    try {
      response = await fetch(urlMethod, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: body,
      });

      return {
        statusCode: response.status,
        body: await response.json(),
        description: response.statusText,
      };
    } catch (error) {
      return {
        statusCode: HttpStatusCode.serverError,
        body: error,
        description: "Internal Server Error",
      };
    }
  }
}
