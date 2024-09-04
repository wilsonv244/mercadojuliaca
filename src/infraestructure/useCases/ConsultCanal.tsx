import {
  MethodPay,
  MethodPayResponse,
} from "@/domain/models/consulting/MethodsPay";
import { FechtMethod } from "../http/FetchMethod";

export async function ConsultCanal(token: string): Promise<MethodPayResponse> {
  let responseMethod: MethodPay[] = [];
  const CallApi = new FechtMethod();
  const urlPath: string = `${process.env.NEXT_PUBLIC_URL_PATH}/api/pagos/reporte/detalle-canales`;

  const responseApi = await CallApi.getMethod(urlPath, token);
  const respuestaApi = responseApi.body?.success;
  const respuestaBody = responseApi.body?.data;
  if (respuestaApi === 1) {
    respuestaBody.forEach((e: MethodPay) => {
      responseMethod.push({ idCanal: e.idCanal, cCanal: e.cCanal });
    });
  }
  return {
    header: {
      code: responseApi.statusCode,
      success: responseApi?.body?.success,
      message: responseApi?.body?.message,
      errors: responseApi?.body?.errors,
    },
    body: responseMethod,
  };
}
