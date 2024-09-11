import { Employee, OptionSeller } from "@/domain/models/clientNavModel/cliente";
import { ClientEntity } from "@/domain/models/serverModel/client/responseGetClientModel";
export async function getAllClientForm(): Promise<OptionSeller[]> {
  const options: OptionSeller[] = [];
  try {
    const response = await fetch("/api/client/getAllClient");

    if (!response.ok) {
      throw new Error(`Error al obtener empleados: ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.clients) {
      data.clients.forEach((item: ClientEntity) => {
        options.push({
          name: item.last_name + " " + item.first_name,
          code: item.id_client.toString(),
        });
      });
      console.log(options);
      return options;
    } else {
      throw new Error("No se encontraron empleados");
    }
  } catch (error) {
    console.error("Error al llamar a la API de empleados:", error);
    return [];
  }
}
