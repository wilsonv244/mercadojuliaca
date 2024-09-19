import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { classNames } from "primereact/utils";
import ModalConfirmRequest from "./modalConfirm";

export default function ReportRequest() {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [requests, setRequests] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [visible, setVisible] = useState(false);

  // Fetching purchase requests data
  useEffect(() => {
    const fetchPurchaseRequests = async () => {
      try {
        const response = await fetch("/api/purchase/getAllPurchaseReq");
        const data = await response.json();
        setRequests(data.data);
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

  // Handle row selection
  const handleSelection = (e) => {
    setSelectedRequest(e.value);
    setVisible(true);
  };

  // Highlight selected row
  const rowClass = (data) =>
    selectedRequest && data.id_request === selectedRequest.id_request
      ? "p-highlight p-selectable-row"
      : "";

  // Render status icon
  const renderStatusIcon = (rowData) => {
    return (
      <i
        className={classNames("pi", {
          "pi-thumbs-up true-icon": rowData.is_approved,
          "pi-times-circle false-icon": !rowData.is_approved,
        })}
      ></i>
    );
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
        onSelectionChange={handleSelection}
        selection={selectedRequest}
        rowClassName={rowClass}
        header={renderHeader}
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
      >
        <Column
          header="#"
          headerStyle={{ width: "4rem" }}
          body={(data, options) => options.rowIndex + 1}
        />
        <Column field="id_request" header="N° Solicitud" />
        <Column field="created_at" header="Fecha Solicitud" />
        <Column field="id_cost_center" header="Id Centro Costos" />
        <Column field="item" header="Articulo" />
        <Column field="description" header="Descripción" />
        <Column field="quantity" header="Cantidad" />
        <Column field="unit_of_measurement" header="Unidad de Medida" />
        <Column field="planned_cost" header="Costo Planeado" />
        <Column field="is_approved" header="Estado" body={renderStatusIcon} />
      </DataTable>
      {visible && (
        <ModalConfirmRequest
          selectedRequest={selectedRequest}
          visible={visible}
          setVisible={setVisible}
        />
      )}
    </div>
  );
}
