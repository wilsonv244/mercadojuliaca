import { consultCatalog } from "@/domain/models/updateCatalogs/consultCatalogModels";

export interface IConsultCatalogue {
  consultToday(): Promise<consultCatalog>;
  consultIntervalCat(
    dFechaInicio: string | null,
    dFechaFin: string | null
  ): Promise<consultCatalog>;
}
