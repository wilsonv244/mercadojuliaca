import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
export default function AlertasReact() {
  const show = (mensaje, state) => {
    if (toast.current) {
      toast.current.show({
        severity: state,
        summary: "Respuesta",
        detail: mensaje,
      });
    }
  };
  const toast = useRef(null);
  return <Toast ref={toast}></Toast>;
}
