import {
  ICPLatamLoginResponseData,
  IloginCPLatam,
} from "@/domain/Interfaces/login/InterfacesLogin";
import { FechtMethod } from "@/infraestructure/http/FetchMethod";

export async function CpLatamResponse(
  data: string
): Promise<ICPLatamLoginResponseData> {
  const CallApi = new FechtMethod();
  let bodyResponse: IloginCPLatam = {
    arrProfile: [],
    cRefreshToken: "",
    cToken: "",
    nExpireIn: 0,
    userName: "",
  };

  const urlApiResponse = `${process.env.NEXT_URL_CPLATAM}/api/authentication/login`;
  const responseApi = await CallApi.postMethod(urlApiResponse, null, data);
  const respuestaApi = responseApi.body?.success;

  if (respuestaApi === 1) {
    bodyResponse = {
      nExpireIn: responseApi.body?.data.nExpireIn,
      cToken: responseApi.body?.data.cToken,
      cRefreshToken: responseApi.body?.data.cRefeshToken,
      arrProfile: responseApi.body?.data.arrProfile,
      userName: responseApi.body?.data.userName,
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
