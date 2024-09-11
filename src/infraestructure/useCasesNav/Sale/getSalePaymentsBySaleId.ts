import prisma from "@/infraestructure/postgressDB/prisma"; // Cambia la ruta si es necesario
import { SalePayment } from "@prisma/client"; // Asegúrate de que el modelo Prisma esté generado correctamente

export async function getSalePaymentsBySaleId(
  idSale: number
): Promise<SalePayment[]> {
  try {
    const salePayments = await prisma.salePayment.findMany({
      where: {
        id_sale: idSale,
      },
      orderBy: {
        payment_registration_date: "desc", // Ordenar por fecha de registro descendente (opcional)
      },
    });
    return salePayments;
  } catch (error) {
    console.error("Error al obtener los pagos por id_sale:", error);
    throw error;
  }
}
