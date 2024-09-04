import { Badge } from "primereact/badge";
import { DataTableTransacciones } from "./DtTransacciones";
import { VisorModalPdf } from "./ModalVisorPdf";
import { useState } from "react";
export function Transacciones() {
  return (
    <>
      <h1 className="mt-4 mb-4">
        Su proxima facturación será:{" "}
        <Badge value="19 de Mayo del 2025" severity="contrast"></Badge>
      </h1>
      <DataTableTransacciones />
      <div className="card flex justify-content-center w-full"></div>
    </>
  );
}
