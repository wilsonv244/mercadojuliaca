import {
  PagosPModels,
  PagosPResponseModels,
  arrKarkexModel,
} from "@/domain/models/consulting/PagosPModels";
import { FechtMethod } from "../http/FetchMethod";
import Helper from "../components/Helper";

export async function ConsPagosProce(
  cFecha: string,
  idCanal: string,
  token: string
): Promise<PagosPModels> {
  const helper = new Helper();
  let bodyResponse: PagosPResponseModels[] = [];
  let arraykardexArray: arrKarkexModel[] = [];
  const CallApi = new FechtMethod();
  const urlPath: string = `${process.env.NEXT_PUBLIC_URL_PATH}/api/pagos/reporte/pagos-procesados?idCanal=${idCanal}&dFecha=${cFecha}`;

  const responseApi = await CallApi.getMethod(urlPath, token);
  const respuestaApi = responseApi.body?.success;
  const respuestaBody = responseApi.body?.data;

  if (respuestaApi === 1) {
    respuestaBody.sort(
      (a: PagosPResponseModels, b: PagosPResponseModels) =>
        new Date(b.dFechaHoraRegistro).getTime() -
        new Date(a.dFechaHoraRegistro).getTime()
    );
    for (let i = 0; i < respuestaBody.length; i++) {
      bodyResponse.push({
        idRegistro: respuestaBody[i].idRegistro,
        cOperacionEmpresa: respuestaBody[i].cOperacionEmpresa,
        idCanal: respuestaBody[i].idCanal,
        cCanal: respuestaBody[i].cCanal,
        idCuenta: respuestaBody[i].idCuenta,
        cTipoOperacion: respuestaBody[i].cTipoOperacion,
        nBalance: respuestaBody[i].nBalance,
        nMontoOperacion: respuestaBody[i].nMontoOperacion,
        dFechaHoraRegistro: helper.formatDate(
          respuestaBody[i].dFechaHoraRegistro
        ),
        arrKardex: respuestaBody[i].arrKardex,
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
