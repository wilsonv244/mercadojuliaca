import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function ShipmentPaymentForm() {
  const [formData, setFormData] = useState({
    id_shipment: "",
    payment_date: null,
    payment_amount: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null); // Para mostrar mensajes de éxito o error

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (e, name) => {
    setFormData({ ...formData, [name]: e.value });
  };

  const validateForm = () => {
    setSubmitted(true);
    return (
      formData.id_shipment && formData.payment_date && formData.payment_amount
    );
  };

  const submitForm = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch("/api/purchase/saveShipmentPayment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_shipment: parseInt(formData.id_shipment),
            payment_date: formData.payment_date.toISOString().split("T")[0], // Solo la fecha
            payment_amount: parseFloat(formData.payment_amount),
          }),
        });

        const result = await response.json();
        if (response.ok) {
          toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Pago de envío registrado correctamente",
          });
          resetForm(); // Limpiar formulario después de la operación exitosa
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Error al registrar el pago de envío",
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
      message: "¿Estás seguro de que deseas registrar este pago de envío?",
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
      id_shipment: "",
      payment_date: null,
      payment_amount: "",
    });
    setSubmitted(false);
  };

  return (
    <div className="card w-4/5 m-auto">
      <Toast ref={toast} />
      <ConfirmDialog />

      <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
        {/* ID del Envío */}
        <div className="field mb-3">
          <label
            htmlFor="id_shipment"
            className="text-[#003462] font-black text-sm mb-3"
          >
            ID del Envío
          </label>
          <div className="flex justify-between">
            <InputText
              value={formData.id_shipment}
              placeholder="Buscar solicitud de Embarque"
              name="id_request"
              onChange={handleInputChange}
              className={classNames({
                "p-invalid": submitted && !formData.id_shipment,
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
          {submitted && !formData.id_shipment && (
            <Message
              className="small-message"
              severity="error"
              text="ID del Envío es requerido"
            />
          )}
        </div>

        <div className="flex justify-between gap-2 bg-red-50 p-3 rounded-lg">
          <div className="field w-full">
            <label
              htmlFor="item"
              className="text-[#003462] font-black text-sm mb-3"
            >
              RUC
            </label>
            <InputText
              id="item"
              disabled
              name="item"
              value="10719380633"
              placeholder="Descripción del artículo"
            />
          </div>
          <div className="field w-full">
            <label
              htmlFor="quantity"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Razón Social
            </label>
            <InputText
              id="quantity"
              name="quantity"
              disabled
              value="Distribuidora de papas"
              placeholder="Cantidad del artículo"
            />
          </div>
        </div>
        <div className="flex justify-between gap-2 bg-red-50 p-3 rounded-lg">
          <div className="field w-full">
            <label
              htmlFor="item"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Monto total orde de compra
            </label>
            <InputText
              id="item"
              disabled
              name="item"
              value="1850"
              placeholder="Descripción del artículo"
            />
          </div>
          <div className="field w-full">
            <label
              htmlFor="quantity"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Abano total
            </label>
            <InputText
              id="quantity"
              name="quantity"
              disabled
              value={180}
              placeholder="Cantidad del artículo"
            />
          </div>
        </div>

        {/* Fecha de Pago */}
        <div className="field mb-3">
          <label
            htmlFor="payment_date"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Fecha de Pago
          </label>
          <Calendar
            id="payment_date"
            name="payment_date"
            value={formData.payment_date}
            onChange={(e) => handleDateChange(e, "payment_date")}
            placeholder="Seleccione la fecha de pago"
            className={classNames({
              "p-invalid": submitted && !formData.payment_date,
            })}
          />
          {submitted && !formData.payment_date && (
            <Message
              className="small-message"
              severity="error"
              text="Fecha de Pago es requerida"
            />
          )}
        </div>

        {/* Monto del Pago */}
        <div className="field mb-3">
          <label
            htmlFor="payment_amount"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Monto de Pago
          </label>
          <InputText
            placeholder="Ingrese el monto de pago"
            id="payment_amount"
            name="payment_amount"
            value={formData.payment_amount}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.payment_amount,
            })}
          />
          {submitted && !formData.payment_amount && (
            <Message
              className="small-message"
              severity="error"
              text="Monto de Pago es requerido"
            />
          )}
        </div>

        <Button
          label={loading ? "Registrando..." : "Registrar Pago"}
          icon="pi pi-check"
          type="button"
          onClick={confirmSubmit}
          disabled={loading}
        />
      </form>
    </div>
  );
}
