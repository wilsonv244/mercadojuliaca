import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function ModalConfirmRequest({
  selectedRequest,
  visible,
  setVisible,
}) {
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const { id_request, item, description, planned_cost, quantity } =
    selectedRequest;

  // Función para confirmar la aprobación de la solicitud
  const confirmarSolicitudCompra = async () => {
    setLoading(true); // Inicia el estado de carga
    try {
      const response = await fetch("/api/purchase/putPurchaseRequestApproved", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_request }),
      });

      const result = await response.json();

      if (result.data.id_request !== null) {
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Solicitud Aprobada Exitosamente",
        });
        setVisible(false);
      } else {
        showToast(result.error || "Error al aprobar la solicitud", "error");
      }
    } catch (error) {
      toast.current.show({
        severity: "info",
        summary: "Cancelado",
        detail: "Error en el servidor:" + error,
      });
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  // Mostrar mensajes usando Toast
  const showToast = (mensaje, severity) => {
    if (toast.current) {
      toast.current.show({
        severity: severity,
        summary: "Respuesta",
        detail: mensaje,
      });
    }
  };

  // Confirmación de la operación
  const confirmSubmit = () => {
    confirmDialog({
      message: "¿Estás seguro de que deseas aprobar esta solicitud?",
      header: "Confirmación",
      icon: "pi pi-exclamation-triangle",
      accept: () => confirmarSolicitudCompra(),
      reject: () =>
        toast.current.show({
          severity: "info",
          summary: "Cancelado",
          detail: "Operación cancelada",
        }),
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        style={{ width: "45vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="text-center">
          <h1 className="text-[#003462] font-black text-xl mb-3">
            Confirmación de la solicitud de Compra
          </h1>
          <p className="m-4 text-sm font-medium">
            {item} - {description}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl">
          <div className="mb-4 w-full flex justify-between items-center mt-3">
            <label htmlFor="id_request" className="mr-3 font-black text-base ">
              N° de Solicitud
            </label>
            <InputText
              disabled
              placeholder="N° Solicitud"
              value={id_request}
              className="w-2/3"
            />
          </div>
          <div className="mb-4 w-full flex justify-between items-center mt-3">
            <label htmlFor="item" className="mr-3 font-black text-base ">
              Articulo
            </label>
            <InputText
              disabled
              placeholder="Articulo"
              value={item}
              className="w-2/3"
            />
          </div>

          <div className="mb-4 w-full flex justify-between items-center mt-3">
            <label htmlFor="quantity" className="mr-3 font-black text-base ">
              Cantidad
            </label>
            <InputText
              disabled
              placeholder="Cantidad"
              value={quantity}
              className="w-2/3"
            />
          </div>

          <div className="mb-4 w-full flex justify-between items-center mt-3">
            <label
              htmlFor="planned_cost"
              className="mr-3 font-black text-base "
            >
              Costo Planeado
            </label>
            <InputText
              disabled
              placeholder="Costo Planeado"
              value={`S/. ${planned_cost}`}
              className="w-2/3"
            />
          </div>
        </div>

        <div className="text-center mt-3">
          <Button
            onClick={confirmSubmit}
            type="button"
            label={loading ? "Confirmando..." : "Confirmar operación"}
            icon="pi pi-check"
            severity="success"
            text
            raised
            disabled={loading} // Deshabilitar el botón mientras está cargando
          />
        </div>

        <ConfirmDialog />
      </Dialog>
    </>
  );
}
