import { ApiResponseModel } from "../general/ApiModel";

export type DasboardCp = {
  cUrl: string;
  cNombreDashboard: string;
  idDashboard: number;
};

export type DasboardCPResponse = {
  header: ApiResponseModel;
  data: DasboardCp[];
};
