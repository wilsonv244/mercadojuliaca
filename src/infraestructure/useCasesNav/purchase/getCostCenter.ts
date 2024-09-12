import { OptionMenu } from "@/domain/models/clientNavModel/cliente";
import { CostCenter } from "@prisma/client";

export async function getCostCenter(): Promise<OptionMenu[]> {
  const options: OptionMenu[] = [];
  try {
    const response = await fetch("/api/purchase/getCostCenter");

    if (!response.ok) {
      throw new Error(
        `Error al obtener los Call Center: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("data");
    console.log(data);
    if (data.length > 0) {
      data.forEach((item: CostCenter) => {
        options.push({
          label: item.cost_center_name,
          value: item.id_center.toString(),
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
