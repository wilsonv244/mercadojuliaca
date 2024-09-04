import {
  RestorePassModels,
  RestorePassResponse,
} from "@/domain/models/login/RestartPassModelo";
import { FechtMethod } from "../../http/FetchMethod";

export async function RestorePass(
  body: string,
  token: string
): Promise<RestorePassModels> {
  const path = `${process.env.NEXT_PUBLIC_URL_PATH}/api/pagos/users`;
  const CallApi = new FechtMethod();
  let respuestaModel: RestorePassResponse = {
    usuario: "",
  };

  const responseApi = await CallApi.putMethod(path, token, body);

  const bodyResponse = responseApi.body?.success;
  if (bodyResponse == 1 && responseApi.statusCode == 200) {
    respuestaModel = {
      usuario: responseApi.body?.data.usuario,
    };
  }
  return {
    header: {
      code: responseApi.statusCode,
      success: responseApi?.body?.success,
      message: responseApi?.body?.message,
      errors: responseApi?.body?.errors,
    },
    body: respuestaModel,
  };
}
