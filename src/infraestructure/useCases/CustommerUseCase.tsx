import {
  BianApiResponse,
  ErrorResponse,
} from "@/domain/Interfaces/bianAdapter/BianErrorInternalAdapter";
import { FechtMethod } from "../http/FetchMethod";
import {
  User,
  UserManagementResponse,
} from "@/domain/Interfaces/custommerAdapter/CustommerRetrieveAdapter";

export async function customerRegister(
  request: string | null
): Promise<BianApiResponse> {
  const callApi = new FechtMethod();
  let errorResponse: ErrorResponse = { errors: [] };

  const urlPath = `${process.env.NEXT_PUBLIC_URL_BACK}/data-platform/v1/customer-relationship-management/data-complete/register`;

  try {
    const responseApi = await callApi.postMethod(urlPath, null, request);
    const { statusCode, body, description } = responseApi;

    if (statusCode === 400) {
      errorResponse = body as ErrorResponse;
    }

    return {
      Code: statusCode,
      Description: description,
      Errors: errorResponse,
    };
  } catch (error) {
    return {
      Code: 500,
      Description: String(error),
    };
  }
}

export async function CustomerRetrive(): Promise<UserManagementResponse> {
  const callApi = new FechtMethod();
  let errorResponse: ErrorResponse = { errors: [] };
  let ListaUsers: User[] = [];
  const urlPath = `${process.env.NEXT_PUBLIC_URL_BUSINESS_LAYER}/coreless-api-gateway/v1/administration/user/basic-data/retrive`;

  try {
    const responseApi = await callApi.getMethod(urlPath, null);
    const { statusCode, body, description } = responseApi;

    if (statusCode >= 300) {
      errorResponse = body as ErrorResponse;
    } else {
      ListaUsers = responseApi.body?.data?.UserManagement?.UserList;
    }

    return {
      Code: statusCode,
      Description: description,
      Errors: errorResponse,
      UserManagement: { UserList: ListaUsers },
    };
  } catch (error) {
    return {
      Code: 500,
      Description: String(error),
    };
  }
}
