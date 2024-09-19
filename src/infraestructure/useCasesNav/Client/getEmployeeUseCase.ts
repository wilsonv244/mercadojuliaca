import { Employee, OptionSeller } from "@/domain/models/clientNavModel/cliente";
export async function getEmployeeFormSaler(): Promise<OptionSeller[]> {
  const options: OptionSeller[] = [];
  try {
    const response = await fetch("/api/client/getEmployee");

    if (!response.ok) {
      throw new Error(`Error al obtener empleados: ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.employees) {
      data.employees.forEach((item: Employee) => {
        options.push({
          name: item.last_name + " " + item.first_name,
          code: item.id_employee.toString(),
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
