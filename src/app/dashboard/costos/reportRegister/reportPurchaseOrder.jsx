import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { classNames } from "primereact/utils";
import ModalConfirmRequest from "./modalConfirm";

export default function ReportePurchaseOrder() {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [requests, setRequests] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [visible, setVisible] = useState(false);

  // Fetching purchase requests data
  useEffect(() => {
    const fetchPurchaseRequests = async () => {
      try {
        const response = await fetch("/api/report/getAllPurchaseOrder");
        const data = await response.json();
        console.log(data);
        setRequests(data.purchaseOrders);
      } catch (error) {
        console.error("Error fetching purchase requests:", error);
      }
    };
    fetchPurchaseRequests();
  }, [visible]);

  // Update global filter
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      global: { ...prev.global, value },
    }));
    setGlobalFilterValue(value);
  };

  // Render header with search input
  const renderHeader = (
    <div className="flex justify-between">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Buscar Solicitud"
        />
      </span>
    </div>
  );

  return (
    <div className="w-full mt-8">
      <h2 className="mb-2 font-bold text-sm text-[#003462]">
        Total registros presentados: {requests.length || 0}
      </h2>
      <DataTable
        value={requests}
        paginator
        filters={filters}
        selectionMode="single"
        header={renderHeader}
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
      >
        <Column
          header="#"
          headerStyle={{ width: "4rem" }}
          body={(data, options) => options.rowIndex + 1}
        />
        <Column field="id_order" header="N° Orden de Compra" />
        <Column field="order_date" header="Fecha Orden de Compra" />
        <Column field="id_request" header="N° Solicitud" />
        <Column field="request.item" header="Articulo" />
        <Column field="request.description" header="Descripcion" />
        <Column field="request.quantity" header="Cantidad" />
        <Column field="request.unit_of_measurement" header="Unidad de Medida" />
        <Column field="request.planned_cost" header="Costo Planeado" />
        <Column field="supplier.legal_name" header="Proveedor" />
        <Column field="total_amount" header="Monto Total" />
      </DataTable>
    </div>
  );
}
