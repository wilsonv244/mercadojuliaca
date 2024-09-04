import {
  ILoginResponseData,
  IloginBody,
} from "@/domain/Interfaces/login/InterfacesLogin";
import { FechtMethod } from "../../http/FetchMethod";
import { ApiResponseModel } from "@/domain/models/general/ApiModel";
import { CryptoMethod } from "@/infraestructure/components/Crypto";

export async function ResponseApiLogin(
  data: string
): Promise<ILoginResponseData> {
  const CallApi = new FechtMethod();
  let bodyResponse: IloginBody = {
    nExpire: 0,
    cToken: "",
    cRefreshToken: "",
  };
  const responseApi = await CallApi.postMethod(
    //`${process.env.NEXT_PUBLIC_URL_PATH}/api/pagos/users`,
    `${process.env.NEXT_PUBLIC_URL_BACK}/api/catalogos/reporte/login`,
    null,
    data
  );

  const respuestaApi = responseApi.body?.success;

  if (respuestaApi === 1) {
    bodyResponse = {
      nExpire: responseApi.body?.data.nExpire,
      cToken: responseApi.body?.data.cToken,
      cRefreshToken: responseApi.body?.data.cRefreshToken,
    };
  }
  return {
    header: {
      code: responseApi.statusCode,
      success: responseApi?.body?.success,
      message: responseApi?.body?.message,
      errors: responseApi?.body?.errors,
    },
    body: bodyResponse,
  };
}
