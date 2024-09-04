import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { printPlugin } from "@react-pdf-viewer/print";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/print/lib/styles/index.css";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
export function VisorModalPdf({
  visibleModalPdf,
  setVisibleModalPdf,
  datoPdf,
}) {
  const [pdfUrl, setPdfUrl] = useState(null);
  console.log(datoPdf.cBoletaBase64);
  const cerrar = () => {
    setVisibleModalPdf(false);
  };
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const byteCharacters = atob(datoPdf.cBoletaBase64);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Failed to decode base64 string:", error);
      }
    };

    fetchPdf();
  }, [datoPdf.cBoletaBase64]);

  const printPluginInstance = printPlugin();
  return (
    <Dialog
      header={`Boleta de Pago: ${datoPdf.dFechaPago}`}
      visible={visibleModalPdf}
      style={{ width: "50vw" }}
      onHide={() => cerrar()}
    >
      <div>
        <div className=" mb-3 card flex flex-wrap justify-content-center gap-2">
          <Tag severity="secondary" value={datoPdf.lEstado}></Tag>
          <Tag severity="info" value={datoPdf.cCliente}></Tag>
          <Tag severity="danger" value={datoPdf.nMontoPago}></Tag>
        </div>
        {pdfUrl ? (
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
          >
            <div style={{ height: "750px" }}>
              <Viewer fileUrl={pdfUrl} plugins={[printPluginInstance]} />
            </div>
          </Worker>
        ) : (
          <p>Loading PDF...</p>
        )}
        <div className="flex">
          <div className="mb-3">
            <Button
              label="Imprimir"
              severity="success"
              onClick={printPluginInstance.print}
            />
          </div>
          <div className="ml-3">
            <Button
              className=" ml-3"
              label="Cerrar"
              severity="danger"
              onClick={() => cerrar()}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
