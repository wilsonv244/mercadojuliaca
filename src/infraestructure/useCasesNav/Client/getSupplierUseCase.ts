import { Employee, OptionSeller } from "@/domain/models/clientNavModel/cliente";
import {
  Supplier,
  SuppliersResponse,
} from "@/domain/models/serverModel/client/responseGetSupplier";
export async function getSupplierUseCase(): Promise<OptionSeller[]> {
  const options: OptionSeller[] = [];
  try {
    const response = await fetch("/api/client/getAllSupplier");

    if (!response.ok) {
      throw new Error(`Error al obtener empleados: ${response.statusText}`);
    }

    const data: SuppliersResponse = await response.json();

    if (data && data.suppliers != undefined) {
      data.suppliers.forEach((item: Supplier) => {
        options.push({
          name: item.legal_name?.toString() ?? "",
          code: item.id_supplier.toString(),
        });
      });

      return options;
    } else {
      throw new Error("No se encontraron empleados");
    }
  } catch (error) {
    console.error("Error al llamar a la API de empleados:", error);
    return [];
  }
}
