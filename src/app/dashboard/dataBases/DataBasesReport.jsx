import React, { useState, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getCuentasPorPagar } from "@/infraestructure/useCasesNav/report/reportCuentasPorPagar";

export default function ReportDataBases({ action }) {
  const [formData, setFormData] = useState({
    d_fecha_inicio: null,
    d_fecha_fin: null,
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const handleDateChange = (e, name) => {
    setFormData({ ...formData, [name]: e.value });
  };

  console.log(action);
  const exportToExcel = async () => {
    let purchaseRequests = [];
    switch (action) {
      case "BASEDATOS":
        const saleResponseBaseCostos = await fetch(
          `/api/report/getAllReportBaseCostos?d_fecha_inicio=${formData.d_fecha_inicio}&d_fecha_fin=${formData.d_fecha_fin}`
        );
        purchaseRequests = await saleResponseBaseCostos.json();
        break;

      case "CUENTASPAGAR":
        const saleResponse = await fetch(
          `/api/report/getAllReportCuentasPagar?d_fecha_inicio=${formData.d_fecha_inicio}&d_fecha_fin=${formData.d_fecha_fin}`
        );
        purchaseRequests = await saleResponse.json();
        break;
      case "BASEINGRESOS":
        const saleResponse2 = await fetch(
          `/api/report/getAllReportCuentasCobrar?d_fecha_inicio=${formData.d_fecha_inicio}&d_fecha_fin=${formData.d_fecha_fin}`
        );
        purchaseRequests = await saleResponse2.json();
        break;
      case "CUENTASCOBRAR":
        const saleResponse3 = await fetch(
          `/api/report/getAllReportBaseIngresos?d_fecha_inicio=${formData.d_fecha_inicio}&d_fecha_fin=${formData.d_fecha_fin}`
        );
        purchaseRequests = await saleResponse3.json();
        break;
      case "MOVBANCARIO":
        const saleResponse4 = await fetch(
          `/api/report/getAllReportBankTransaction?d_fecha_inicio=${formData.d_fecha_inicio}&d_fecha_fin=${formData.d_fecha_fin}`
        );
        purchaseRequests = await saleResponse4.json();
        break;
    }
    console.log(purchaseRequests.length);
    if (purchaseRequests.length === 0) {
      toast.current.show({
        severity: "warn",
        summary: "Atención",
        detail:
          "No se encontraron registros para el rango de fechas seleccionado",
      });
      setLoading(false);
      return;
    }

    // Crear hoja de cálculo
    let worksheet = "";
    let nombreArchivoExcel = "";
    switch (action) {
      case "BASEDATOS":
        worksheet = XLSX.utils.json_to_sheet(purchaseRequests);
        nombreArchivoExcel = "Reporte_Base_de_costos";
        break;
      case "CUENTASPAGAR":
        worksheet = XLSX.utils.json_to_sheet(purchaseRequests);
        nombreArchivoExcel = "Reporte_Cuentas_Pagar";
        break;
      case "BASEINGRESOS":
        worksheet = XLSX.utils.json_to_sheet(purchaseRequests);
        nombreArchivoExcel = "Reporte_Base_Ingresos";
        break;
      case "CUENTASCOBRAR":
        worksheet = XLSX.utils.json_to_sheet(purchaseRequests);
        nombreArchivoExcel = "Reporte_Cuentas_Cobrar";
        break;
      case "MOVBANCARIO":
        worksheet = XLSX.utils.json_to_sheet(purchaseRequests);
        nombreArchivoExcel = "Reporte_Movimiento_Bancario";
        break;
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, nombreArchivoExcel);

    // Guardar el archivo
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `${nombreArchivoExcel}.xlsx`);

    toast.current.show({
      severity: "success",
      summary: "Éxito",
      detail: "Datos exportados a Excel correctamente",
    });
    setLoading(false);
  };

  // Confirmación de exportación
  const confirmExport = () => {
    confirmDialog({
      message: "¿Estás seguro de que deseas exportar los datos a Excel?",
      header: "Confirmación de Exportación",
      icon: "pi pi-exclamation-triangle",
      accept: () => exportToExcel(),
      reject: () =>
        toast.current.show({
          severity: "info",
          summary: "Cancelado",
          detail: "Operación cancelada",
        }),
    });
  };

  return (
    <div className="card w-4/5 m-auto mt-6">
      <Toast ref={toast} />
      <ConfirmDialog />

      <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
        <div className="field mb-3">
          <label
            htmlFor="d_fecha_inicio"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Fecha de Inicio
          </label>
          <Calendar
            id="d_fecha_inicio"
            name="d_fecha_inicio"
            value={formData.d_fecha_inicio}
            onChange={(e) => handleDateChange(e, "d_fecha_inicio")}
            placeholder="Seleccione la fecha de inicio"
            showIcon
          />
        </div>

        <div className="field mb-3">
          <label
            htmlFor="d_fecha_fin"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Fecha de Fin
          </label>
          <Calendar
            id="d_fecha_fin"
            name="d_fecha_fin"
            value={formData.d_fecha_fin}
            onChange={(e) => handleDateChange(e, "d_fecha_fin")}
            placeholder="Seleccione la fecha de fin"
            showIcon
          />
        </div>
      </form>

      <Button
        label={loading ? "Exportando..." : "Exportar a Excel"}
        icon="pi pi-file-excel"
        onClick={confirmExport}
        disabled={loading}
        className="w-full m-auto mt-6"
      />
    </div>
  );
}
