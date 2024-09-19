import {
  BianApiResponse,
  ErrorResponse,
} from "@/domain/Interfaces/bianAdapter/BianErrorInternalAdapter";

import {
  DataTableUserProfiels,
  UserManagementProfile,
  UserProfile,
} from "@/domain/Interfaces/profile/IRegisterProfile";
import { FechtMethod } from "@/infraestructure/http/FetchMethod";

export async function ProfileRetrieve(): Promise<UserManagementProfile> {
  const callApi = new FechtMethod();
  let errorResponse: ErrorResponse = { errors: [] };
  let listaPerfiles: UserProfile[] = [];

  const urlPath = `${process.env.NEXT_PUBLIC_URL_BUSINESS_LAYER}/coreless-api-gateway/v1/administration/profile/basic-data/retrieve`;
  try {
    const responseApi = await callApi.getMethod(urlPath, null);
    const { statusCode, body, description } = responseApi;

    if (statusCode >= 300) {
      errorResponse = body as ErrorResponse;
    } else {
      listaPerfiles = responseApi.body?.data?.UserManagement?.UserProfiles;

      let dataPerfiles: DataTableUserProfiels[] = listaPerfiles.flatMap(
        (perfil) => {
          return perfil.Users.map((user) => {
            return {
              ProfileID: perfil.ProfileID,
              ProfileName: perfil.ProfileName,
              IsActive: perfil.IsActive,
              UserID: user.UserID,
              UserName: user.UserName,
              LastAccessDate: user.LastAccessDate,
              RegistrationDate: user.RegistrationDate,
            };
          });
        }
      );
    }
    return {
      Code: statusCode,
      Description: description,
      Errors: errorResponse,
      UserProfiles: listaPerfiles,
    };
  } catch (error) {
    return {
      Code: 500,
      Description: String(error),
    };
  }
}
