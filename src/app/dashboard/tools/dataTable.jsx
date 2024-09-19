import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React from "react";

export function DataTableLista({
  setSelectedProduct,
  setSelectItem,
  selectedProduct,
  nombreDashboard,
  data,
}) {
  const seleccionar = (e) => {
    setSelectedProduct(e);
    setSelectItem(e.value);
  };
  const eventStyleTable = (e) => {
    if (selectedProduct != null) {
      const estilo =
        e.id == selectedProduct.value.id ? " p-highlight p-selectable-row" : "";

      return estilo;
    }
  };
  return (
    <>
      <DataTable
        value={data}
        rows={10}
        onSelectionChange={(e) => seleccionar(e)}
        dataKey="id"
        selectionMode="single"
        selection={selectedProduct}
        rowClassName={eventStyleTable}
        //rowClassName={eventStyleTable}
        dragSelection
      >
        <Column
          style={eventStyleTable}
          field="cName"
          header={nombreDashboard}
        ></Column>
      </DataTable>
    </>
  );
}

export const getEstadoPerfi = (status) => {
  switch (status) {
    case true:
      return "success";

    case false:
      return "danger";
  }
};

export function footerTemplate(dataPerfil) {
  return (
    <React.Fragment>
      <td colSpan={5}>
        <div className="flex justify-content-end font-bold w-full"></div>
      </td>
    </React.Fragment>
  );
}
