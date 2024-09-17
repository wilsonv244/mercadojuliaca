import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { getPurchaseOrderById } from "@/infraestructure/useCasesNav/purchase/getPurchaseOrderbyId";
//import { getOrders } from "@/infraestructure/useCasesNav/purchase/getOrders"; // Assuming there's a function to get orders

export default function PurchaseShipmentForm() {
  const [formData, setFormData] = useState({
    id_order: "",
    shipment_date: null,
    receipt_type: "",
    receipt_number: "",
    payment_type: "",
    payment_due_date: null,
    payment_status: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderOptions, setOrderOptions] = useState([]);
  const [requests, setRequests] = useState({});
  const toast = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = (e, name) => {
    setFormData({ ...formData, [name]: e.value });
  };

  const validateForm = () => {
    setSubmitted(true);
    return (
      Number(formData.id_order) &&
      formData.receipt_type &&
      formData.receipt_number &&
      formData.payment_type &&
      formData.payment_due_date
    );
  };

  const submitForm = async () => {
    console.log(formData);
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch("/api/purchase/savePurchaseShipment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Solicitud de Enbarque registrado correctamente",
          });
          resetForm(); // Limpiar el formulario tras la operación exitosa
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Error al registrar el envío",
          });
        }
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error de conexión con el servidor",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const confirmSubmit = () => {
    confirmDialog({
      message: "¿Estás seguro de que deseas registrar este envío?",
      header: "Confirmación de Registro",
      icon: "pi pi-exclamation-triangle",
      accept: () => submitForm(),
      reject: () =>
        toast.current.show({
          severity: "info",
          summary: "Cancelado",
          detail: "Operación cancelada",
        }),
    });
  };

  const resetForm = () => {
    setFormData({
      id_order: "",
      shipment_date: null,
      receipt_type: "",
      receipt_number: "",
      payment_type: "",
      payment_due_date: null,
      payment_status: false,
    });
    setRequests({});
    setSubmitted(false);
  };

  const llamarApiVenta = async () => {
    const apiPurchaseId = await getPurchaseOrderById(formData.id_order);
    setRequests(apiPurchaseId);
    console.log(requests);
  };

  return (
    <div className="card w-4/5 m-auto">
      <Toast ref={toast} />
      <ConfirmDialog />

      <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
        {/* Order */}
        <div className="field mb-3">
          <label
            htmlFor="id_order"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Orden de Compra
          </label>
          <div className="flex justify-between">
            <InputText
              value={formData.id_order}
              placeholder="Buscar una orden de compra"
              name="id_order"
              onChange={handleInputChange}
              className={classNames({
                "p-invalid": submitted && !formData.id_order,
              })}
            />
            <div className="w-1/12">
              <Button
                onClick={() => llamarApiVenta()}
                className="m-3"
                icon="pi pi-search"
                rounded
                text
                severity="success"
                aria-label="Search"
              />
            </div>
          </div>
          {submitted && !formData.id_order && (
            <Message
              className="small-message"
              severity="error"
              text="Orden de Compra es requerida"
            />
          )}
        </div>

        <div
          className={`flex justify-between gap-2  p-3 rounded-lg ${
            requests.status_code !== 200 ? "bg-red-50" : "bg-green-50"
          }`}
        >
          <div className="field w-full">
            <label
              htmlFor="item"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Razón Social del proveedor
            </label>
            <InputText
              id="item"
              disabled
              name="item"
              value={requests.supplier_name || "" + ` - ` + requests.ruc || ""}
              placeholder="Descripción del artículo"
            />
          </div>
          <div className="field w-full">
            <label
              htmlFor="quantity"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Monto del Producto
            </label>
            <InputText
              id="quantity"
              name="quantity"
              disabled
              value={requests.cost || ""}
              placeholder="Monto del producto"
            />
          </div>
        </div>
        {/* Shipment Date */}

        {/* Receipt Type */}
        <div className="field mb-3">
          <label
            htmlFor="receipt_type"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Tipo de Recibo
          </label>
          <InputText
            id="receipt_type"
            name="receipt_type"
            value={formData.receipt_type}
            onChange={handleInputChange}
            placeholder="Ingrese el tipo de recibo (Factura, Ticket, etc.)"
            className={classNames({
              "p-invalid": submitted && !formData.receipt_type,
            })}
          />
          {submitted && !formData.receipt_type && (
            <Message
              className="small-message"
              severity="error"
              text="Tipo de Recibo es requerido"
            />
          )}
        </div>

        {/* Receipt Number */}
        <div className="field mb-3">
          <label
            htmlFor="receipt_number"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Número de Recibo
          </label>
          <InputText
            id="receipt_number"
            name="receipt_number"
            value={formData.receipt_number}
            onChange={handleInputChange}
            placeholder="Ingrese el número de recibo"
            className={classNames({
              "p-invalid": submitted && !formData.receipt_number,
            })}
          />
          {submitted && !formData.receipt_number && (
            <Message
              className="small-message"
              severity="error"
              text="Número de Recibo es requerido"
            />
          )}
        </div>

        {/* Payment Type */}
        <div className="field mb-3">
          <label
            htmlFor="payment_type"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Tipo de Pago
          </label>
          <InputText
            id="payment_type"
            name="payment_type"
            value={formData.payment_type}
            onChange={handleInputChange}
            placeholder="Ingrese el tipo de pago (Transferencia bancaria, etc.)"
            className={classNames({
              "p-invalid": submitted && !formData.payment_type,
            })}
          />
          {submitted && !formData.payment_type && (
            <Message
              className="small-message"
              severity="error"
              text="Tipo de Pago es requerido"
            />
          )}
        </div>

        {/* Payment Due Date */}
        <div className="field mb-3">
          <label
            htmlFor="payment_due_date"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Fecha de Vencimiento de Pago
          </label>
          <Calendar
            id="payment_due_date"
            name="payment_due_date"
            value={formData.payment_due_date}
            onChange={(e) => handleDropdownChange(e, "payment_due_date")}
            placeholder="Seleccione la fecha de vencimiento del pago"
            className={classNames({
              "p-invalid": submitted && !formData.payment_due_date,
            })}
          />
          {submitted && !formData.payment_due_date && (
            <Message
              className="small-message"
              severity="error"
              text="Fecha de vencimiento de pago es requerida"
            />
          )}
        </div>

        {/* Payment Status */}
        <div className="field mb-3">
          <label
            htmlFor="payment_status"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Estado de Pago
          </label>
          <Dropdown
            value={formData.payment_status}
            onChange={(e) => handleDropdownChange(e, "payment_status")}
            options={[
              { label: "Pagado", value: true },
              { label: "Pendiente", value: false },
            ]}
            placeholder="Seleccione el estado de pago"
          />
        </div>

        <Button
          label={loading ? "Guardando..." : "Registrar Envío"}
          icon="pi pi-check"
          onClick={confirmSubmit}
          disabled={loading}
        />
      </form>
    </div>
  );
}
