import { ValidarPagoResponseModel } from "@/domain/models/validation/ValidPago";
import { FechtMethod } from "../http/FetchMethod";

export async function ValidarPago(
  token: string,
  body: string
): Promise<ValidarPagoResponseModel> {
  const path: string =
    `${process.env.NEXT_PUBLIC_URL_PATH}/api/pagos/regularizacion/pago-extorno`;
  let respuestaApi: string = "hubo un error";
  const CallApi = new FechtMethod();
  const responseApi = await CallApi.postMethod(path, token, body);
  if (responseApi.statusCode != 200) {
    respuestaApi = "exitoso";
  }
  return {
    header: {
      code: responseApi.statusCode,
      success: responseApi?.body?.success,
      message: responseApi?.body?.message,
      errors: responseApi?.body?.errors,
    },
    body: respuestaApi,
  };
}
