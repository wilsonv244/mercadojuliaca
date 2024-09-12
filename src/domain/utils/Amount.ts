export const MontoConIgv = (montoSinIgv: number) => {
  console.log(montoSinIgv);

  if (montoSinIgv > 0) {
    const igv = 0.18;
    const montoConIgv = montoSinIgv * (1 + igv);
    return montoConIgv.toFixed(2);
  }

  return "0.00";
};

export const calcularIgv = (montoSinIgv: number) => {
  const igv = 0.18;
  const montoIgv = montoSinIgv * igv; // Calcular el valor del IGV
  return montoIgv.toFixed(2); // Retorna el valor del IGV con dos decimales
};
