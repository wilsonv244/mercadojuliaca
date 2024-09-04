import Helper from "../components/Helper";
import { FechtMethod } from "../http/FetchMethod";
import {
  PagosNPModels,
  PagosNPResponseModels,
} from "@/domain/models/consulting/PagosNPModels";

export async function ConsPagosNoProce(
  token: string,
  fechaConsulta: string | null
): Promise<PagosNPModels> {
  let bodyResponse: PagosNPResponseModels[] = [];
  const CallApi = new FechtMethod();
  const helper = new Helper();

  const urlPath =
    fechaConsulta == null
      ? `${process.env.NEXT_PUBLIC_URL_PATH}/api/pagos/reporte/pagos-no-procesados`
      : `${process.env.NEXT_PUBLIC_URL_PATH}/api/pagos/reporte/pagos-no-procesados?dFecha=${fechaConsulta}`;
  const responseApi = await CallApi.getMethod(urlPath, token);
  const respuestaApi = responseApi.body?.success;

  if (responseApi.statusCode != 500) {
    if (respuestaApi === 1 && responseApi.body?.data.length != undefined) {
      responseApi.body?.data.map((e: PagosNPResponseModels) => {
        bodyResponse.push({
          cOperacionEmpresa: e.cOperacionEmpresa,
          idCanal: e.idCanal,
          cCanal: e.cCanal,
          idCuenta: e.idCuenta,
          cTipoOperacion: e.cTipoOperacion,
          nMontoOperacion: e.nMontoOperacion,
          dFechaHoraRegistro: helper.formatDate(e.dFechaHoraRegistro),
          nIntentoPago: e.nIntentoPago,
          cEstado: e.cEstado,
        });
      });
    }
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
