
export async function getSaleByReceiptNumber(receiptNumber: string) {
  try {
    const response = await fetch(
      `/api/sale/getByReceiptNumber?receipt_number=${receiptNumber}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener la venta: ${response.statusText}`);
    }

    const saleData = await response.json();
    return saleData;
  } catch (error) {
    console.error("Error al llamar a la API de ventas:", error);
    throw error; // Puedes manejar el error o lanzar la excepción para manejarla externamente
  }
}
