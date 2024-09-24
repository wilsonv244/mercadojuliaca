import React, { useState, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getCuentasPorPagar } from "@/infraestructure/useCasesNav/report/reportCuentasPorPagar";

export default function ReportDataBases({ action }) {
  console.log(action);
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const handleDateChange = (e, name) => {
    setFormData({ ...formData, [name]: e.value });
  };

  const exportToExcel = async () => {
    setLoading(true);
    let purchaseRequests = [];
    switch (action) {
      case "BASEDATOS":
        const responseCuentasPagar = await getCuentasPorPagar();
        purchaseRequests = responseCuentasPagar.lsPurchaseDetail;
        break;
      case "CUENTASPAGAR":
        const saleResponse = await fetch(
          `/api/report/getAllReportPurchaseOrder`
        );
        purchaseRequests = await saleResponse.json();
        break;
      case "BASEINGRESOS":
        const saleResponse2 = await fetch(
          `/api/report/getAllReportBaseIngresos`
        );
        purchaseRequests = await saleResponse2.json();
        break;
      case "CUENTASCOBRAR":
        const saleResponse3 = await fetch(
          `/api/report/getAllReportCuentasCobrar`
        );
        purchaseRequests = await saleResponse3.json();
        break;
    }

    console.log(purchaseRequests);

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

    // Convertir los datos a formato JSON para Excel
    const worksheetData = purchaseRequests.map((request) => ({
      id_solicitud_compra: request.sol_num,
      "Centro de Costo": request.sol_sub_cen_costo,
      "Fecha de Solicitud": request.fecha_registro,
      Articulo: request.sol_articulo,
      Descripción: request.sol_descripcion,
      Cantidad: request.sol_cantidad,
      "Unidad de Medida": request.sol_unidad_medida,
      "Costo Planificado": request.sol_costo_planificado,
      Estado: request.sol_estado,
      "Quien Aprobo": request.sol_aprobado_por,
      ID_Nro_Orden_Compra: request.ord_nro,
      Proveedor: request.ord_prov_razon,
      RUC: request.ord_prov_ruc,
      "RAZON SOCIAL": request.ord_prov_razon,
      "FECHA ORDER COMPRA": request.ord_fecha,
      "MONTO TOTAL": request.ord_monto_total,
      "MONTO SIN IGV": request.ord_monto_sin_igv,
      IGV: request.ord_monto_total - request.ord_monto_sin_igv,
      "ID EMBARQUE": request.emb_nro,
      "TIPO RECIBO": request.emb_tipo_recibo,
      "FECHA VENCIMIENTO": request.emb_fecha_venc,
      "ESTADO PAGO": request.emb_estado,
      "FECHA NOTA CREDITO": request.ord_fecha,
    }));

    // Crear hoja de cálculo
    let worksheet = "";
    switch (action) {
      case "BASEDATOS":
        worksheet = XLSX.utils.json_to_sheet(worksheetData);
        break;
      case "CUENTASPAGAR":
        worksheet = XLSX.utils.json_to_sheet(purchaseRequests);
        break;
      case "BASEINGRESOS":
        worksheet = XLSX.utils.json_to_sheet(purchaseRequests);
        break;
      case "CUENTASCOBRAR":
        worksheet = XLSX.utils.json_to_sheet(purchaseRequests);
        break;
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitudes");

    // Guardar el archivo
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "Solicitudes_de_Compra.xlsx");

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
      {/*
      <form onSubmit={(e) => e.preventDefault()} className="p-fluid">

        <div className="field mb-3">
          <label
            htmlFor="startDate"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Fecha de Inicio
          </label>
          <Calendar
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={(e) => handleDateChange(e, "startDate")}
            placeholder="Seleccione la fecha de inicio"
            showIcon
          />
        </div>

        <div className="field mb-3">
          <label
            htmlFor="endDate"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Fecha de Fin
          </label>
          <Calendar
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={(e) => handleDateChange(e, "endDate")}
            placeholder="Seleccione la fecha de fin"
            showIcon
          />
        </div>

        </form> 
        */}
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
