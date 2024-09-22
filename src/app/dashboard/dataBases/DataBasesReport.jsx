import React, { useState, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export default function ReportDataBases() {
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const handleDateChange = (e, name) => {
    setFormData({ ...formData, [name]: e.value });
  };

  const fetchPurchaseRequests = async () => {
    const { startDate, endDate } = formData;
    try {
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al obtener los datos",
      });
      return [];
    }
  };

  const exportToExcel = async () => {
    setLoading(true);
    const purchaseRequests = await fetchPurchaseRequests();
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
      "ID Solicitud": request.id_request,
      "Centro de Costo": request.id_cost_center,
      "Fecha de Solicitud": new Date(request.request_date).toLocaleDateString(),
      Artículo: request.item,
      Descripción: request.description || "",
      Cantidad: request.quantity,
      "Unidad de Medida": request.unit_of_measurement,
      "Costo Planificado": request.planned_cost,
      Aprobado: request.is_approved ? "Sí" : "No",
      "Fecha Creación": new Date(request.created_at).toLocaleDateString(),
    }));

    // Crear hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
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
    <div className="card w-4/5 m-auto">
      <Toast ref={toast} />
      <ConfirmDialog />

      <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
        {/* Fecha de Inicio */}
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

        {/* Fecha de Fin */}
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

        <Button
          label={loading ? "Exportando..." : "Exportar a Excel"}
          icon="pi pi-file-excel"
          onClick={confirmExport}
          disabled={loading}
        />
      </form>
    </div>
  );
}
