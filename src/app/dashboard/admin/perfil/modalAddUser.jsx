import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import dtUsuario from "../../gobiernoDatos/usuarios.json";
import { useState } from "react";
export function ModalTablaUsuario({
  setLsUsuario,
  selectedCustomers,
  setSelectedCustomers,
}) {
  console.log(selectedCustomers);
  return (
    <>
      <div>
        <DataTable
          selectionMode="checkbox"
          paginator
          rows={10}
          value={dtUsuario.perfiles}
          rowsPerPageOptions={[5, 10, 25, 50]}
          selection={selectedCustomers}
          onSelectionChange={(e) => setSelectedCustomers(e.value)}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column field="idUsuario" header="IdUsuario"></Column>
          <Column field="cUser" header="Usuario"></Column>
          <Column field="dUltimoAcceso" header="Ultimo Acceso"></Column>
          {/* <Column body={showVigenciaUpdate} header="ESTADO"></Column>
        <Column body={ShowVigencia} header="VIGENCIA"></Column> */}
        </DataTable>
      </div>
    </>
  );
}
