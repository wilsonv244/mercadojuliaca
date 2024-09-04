"use client";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import catalogos from "./listDashboard.json";
import { useState } from "react";
import { PanelDashoard } from "./PanelDashboard";
export default function DataTableDashboard({ cResponseDashboard }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectItem, setSelectItem] = useState(null);
  const seleccionar = (e) => {
    setSelectedProduct(e);
    setSelectItem(e.value);
  };
  const eventStyleTable = (e) => {
    if (selectedProduct != null) {
      const estilo =
        e.idDasboard == selectedProduct.value.idDasboard
          ? " p-highlight p-selectable-row"
          : "";
      return estilo;
    }
  };
  return (
    <>
      <div className=" lg:w-1/6 w-11/12 mb-5">
        <DataTable
          value={cResponseDashboard}
          rows={10}
          onSelectionChange={(e) => seleccionar(e)}
          dataKey="idDashboard"
          selectionMode="single"
          selection={selectedProduct}
          rowClassName={eventStyleTable}
          dragSelection
        >
          <Column field="cNombreDashboard" header="Menus"></Column>
        </DataTable>
      </div>
      <div className=" lg:w-4/5 w-11/12">
        {selectItem != null ? <PanelDashoard selectItem={selectItem} /> : <></>}
      </div>
    </>
  );
}
