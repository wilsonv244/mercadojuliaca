import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { getShipPayDataByIdUseCase } from "@/infraestructure/useCasesNav/shipment/getShipPayDataFormUseCase";
import { Entidades, TipoComprobanteLiquidez } from "../../tools/TypeTables";
import { Dropdown } from "primereact/dropdown";

export default function ShipmentPaymentForm() {
  const [formData, setFormData] = useState({
    id_shipment: "",
    payment_date: null,
    payment_amount: "",
    bank_type: 0,
    receipt_type: 0,
    operation_number: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState({});
  const [bank, setBank] = useState([]);
  const [receiptType, setreceiptType] = useState([]);
  const toast = useRef(null); // Para mostrar mensajes de éxito o error

  useEffect(() => {
    const getBank = async () => {
      const response = await fetch("/api/tablesType/getBank", {
        method: "GET", // Corrección aquí
      });
      const result = await response.json();
      console.log(result);
      setBank(result);
    };
    const getReceipType = async () => {
      const response = await fetch("/api/tablesType/getReceipType", {
        method: "GET", // Corrección aquí
      });
      const result = await response.json();
      console.log(result);
      setreceiptType(result);
    };
    getBank();
    getReceipType();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (e, name) => {
    setFormData({ ...formData, [name]: e.value });
  };
  const handleDropdownChange = (e, name) => {
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
      if (Number(formData.payment_amount) > requests.amount_pending) {
        toast.current.show({
          severity: "info",
          summary: "Cancelado",
          detail: "El monto supera el saldo de la deuda",
        });
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("/api/shipment/saveShipmentPayment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_shipment: parseInt(requests.id_shipment),
            payment_date: formData.payment_date.toISOString().split("T")[0], // Solo la fecha
            payment_amount: parseFloat(formData.payment_amount),
            id_bank: formData.bank_type,
            operation_number: formData.operation_number,
            id_receipt_type: formData.receipt_type,
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
    setRequests({});
  };

  const llamarApiVenta = async () => {
    const apiPurchaseId = await getShipPayDataByIdUseCase(
      null,
      formData.id_shipment
    );

    setRequests(apiPurchaseId);
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
            Nro de Recibo
          </label>
          <div className="flex justify-between">
            <InputText
              value={formData.id_shipment}
              placeholder="Buscar solicitud de Embarque"
              name="id_shipment"
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

        <div
          className={`p-3 rounded-lg ${
            requests.status_code !== 200 ? "bg-red-50" : "bg-green-50"
          }`}
        >
          <div className="flex justify-between gap-2">
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
                value={requests.ruc || ""}
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
                value={requests.legal_name}
                placeholder="Cantidad del artículo"
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="field w-full">
              <label
                htmlFor="item"
                className="text-[#003462] font-black text-sm mb-3"
              >
                Monto Total de compra
              </label>
              <InputText
                id="item"
                disabled
                name="item"
                value={requests.total_amount || 0}
                placeholder="Descripción del artículo"
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="field w-full">
              <label
                htmlFor="item"
                className="text-[#003462] font-black text-sm mb-3"
              >
                Saldo de pago
              </label>
              <InputText
                id="item"
                disabled
                name="item"
                value={requests.amount_pending || 0}
                placeholder="Descripción del artículo"
              />
            </div>
            <div className="field w-full">
              <label
                htmlFor="quantity"
                className="text-[#003462] font-black text-sm mb-3"
              >
                Fecha de vencimiento
              </label>
              <InputText
                id="quantity"
                name="quantity"
                disabled
                value={
                  requests.payment_due_date
                    ? new Date(requests.payment_due_date).toLocaleDateString(
                        "es-CO"
                      )
                    : ""
                }
                placeholder="Cantidad del artículo"
              />
            </div>
          </div>
        </div>

        <div className="field mb-3">
          <label
            htmlFor="receipt_type"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Tipo de Comprobante
          </label>
          <Dropdown
            id="receipt_type"
            name="receipt_type"
            options={receiptType}
            value={formData.receipt_type}
            onChange={(e) => handleDropdownChange(e, "receipt_type")}
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
        <div className="field mb-3">
          <label
            htmlFor="bank_type"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Nombre Banco
          </label>
          <Dropdown
            id="bank_type"
            name="bank_type"
            options={bank}
            value={formData.bank_type}
            onChange={(e) => handleDropdownChange(e, "bank_type")}
            placeholder="Seleccione una Entidad"
            className={classNames({
              "p-invalid": submitted && !formData.bank_type,
            })}
          />
          {submitted && !formData.bank_type && (
            <Message
              className="small-message"
              severity="error"
              text="Tipo de Recibo es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="operation_number"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Nro de Operación
          </label>
          <InputText
            placeholder="Ingrese el número de operación"
            id="operation_number"
            name="operation_number"
            value={formData.operation_number}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.operation_number,
            })}
          />
          {submitted && !formData.operation_number && (
            <Message
              className="small-message"
              severity="error"
              text="Monto de Pago es requerido"
            />
          )}
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
            Monto de Pago Incluye IGV
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
