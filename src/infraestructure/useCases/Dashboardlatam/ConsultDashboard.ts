import {
  DasboardCPResponse,
  DasboardCp,
} from "@/domain/models/dashboard-cp/ConsDashboard";
import {
  ApiErrorsModel,
  ApiResponseModel,
} from "@/domain/models/general/ApiModel";
import { CryptoMethod } from "@/infraestructure/components/Crypto";
import { FechtMethod } from "@/infraestructure/http/FetchMethod";

export async function ConsultDashboard(
  cUrl: string
): Promise<DasboardCPResponse> {
  const CallApi = new FechtMethod();

  const helper = new CryptoMethod();
  const responseApi = await CallApi.getMethod(
    cUrl,
    helper.getLocalStorage("cToken")
  );

  let ApiResponse: ApiResponseModel = {
    code: responseApi.statusCode,
    success: responseApi.body?.success || 0,
    message: "Ejecutado Exitosamente",
    errors: [],
  };
  if (responseApi.statusCode === 200) {
    if (responseApi.body?.success === 1) {
      const lsDataResponse: DasboardCp[] =
        responseApi.body?.data.lsQuickSight.length > 0
          ? responseApi.body?.data.lsQuickSight.map((element: DasboardCp) => ({
              cUrl: element.cUrl,
              cNombreDashboard: element.cNombreDashboard,
              idDashboard: element.idDashboard,
            }))
          : [];
      ApiResponse.code = responseApi.statusCode;
      ApiResponse.success = 1;
      return {
        header: ApiResponse,
        data: lsDataResponse,
      };
    } else {
      ApiResponse.errors = responseApi.body?.errors.map(
        (e: ApiErrorsModel) => ({ message: e.message, code: e.code })
      );
    }
  } else {
    ApiResponse.code = responseApi.statusCode;
    ApiResponse.message = responseApi.body;
  }

  return {
    header: ApiResponse,
    data: [],
  };
}
