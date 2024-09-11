import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { getEmployeeFormSaler } from "@/infraestructure/useCasesNav/Client/getEmployeeUseCase";
import { getSaleByReceiptNumber } from "@/infraestructure/useCasesNav/Sale/salePaymentUseCase";

export default function SalePaymentForm() {
  const [formData, setFormData] = useState({
    id_sale: "",
    id_employee: "",
    payment_registration_date: null,
    description: "",
    payment_amount: "",
  });

  const [MontoTotal, setMontoTotal] = useState(0);
  const [MontoDeuda, setMontoDeuda] = useState(0);

  const [submitted, setSubmitted] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [optionSeller, setOptionSeller] = useState([]);
  const toast = useRef(null); // Referencia para el Toast

  useEffect(() => {
    async function fetchEmployees() {
      const options = await getEmployeeFormSaler();
      console.log(options);
      setOptionSeller(options);
    }
    fetchEmployees();
  }, []);

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
      formData.id_sale &&
      formData.id_employee &&
      formData.payment_registration_date &&
      formData.description &&
      formData.payment_amount
    );
  };
  const llamarApiVenta = async () => {
    console.log("id_sale");
    console.log(id_sale.value);
    const responseSalePayment = await getSaleByReceiptNumber(id_sale.value);
    if (responseSalePayment.statusCode != 200) {
      toast.current.show({
        severity: "info",
        summary: "Cancelado",
        detail: "No se encontro datos con ese recibo",
      });
    }
    setMontoDeuda(responseSalePayment.deuda_total);
    setMontoTotal(responseSalePayment.total_amount);
    console.log("responseSalePayment2");
    console.log(responseSalePayment);
  };

  const submitForm = async () => {
    console.log(JSON.stringify(formData));
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch("/api/payment/savePayment", {
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
            detail: "Pago registrado correctamente",
          });
          resetForm(); // Limpiar el formulario tras la operación exitosa
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Error al registrar el pago",
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

  // Confirmación antes de guardar
  const confirmSubmit = () => {
    confirmDialog({
      message: "¿Estás seguro de que deseas registrar este pago?",
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

  // Resetear el formulario
  const resetForm = () => {
    setFormData({
      id_sale: "",
      id_employee: "",
      payment_registration_date: null,
      description: "",
      payment_amount: "",
    });
    setSubmitted(false);
  };

  return (
    <div className="card w-4/5 m-auto">
      <Toast ref={toast} />
      <ConfirmDialog />

      <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
        <div className="field mb-3">
          <label
            htmlFor="id_sale"
            className="text-[#003462] font-black text-sm mb-3"
          >
            ID Venta
          </label>
          <div className="flex justify-between">
            <InputText
              placeholder="Ingrese el ID de la venta"
              id="id_sale"
              name="id_sale"
              value={formData.id_sale}
              onChange={handleInputChange}
              className={classNames({
                "p-invalid": submitted && !formData.id_sale,
              })}
            />
            <div className=" w-1/12">
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
          {submitted && !formData.id_sale && (
            <Message
              className="small-message"
              severity="error"
              text="ID Venta es requerido"
            />
          )}
        </div>
        <div className="flex justify-between">
          <div className="field mb-3">
            <label
              htmlFor="Monto Total"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Monto Total
            </label>
            <InputText
              placeholder="Ingrese el ID de la venta"
              id="MontoTotal"
              disabled
              name="MontoTotal"
              value={MontoTotal}
            />
          </div>
          <div className="field mb-3">
            <label
              htmlFor="Monto Total"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Monto Deuda
            </label>
            <InputText
              placeholder="Ingrese el ID de la venta"
              id="MontoDeuda"
              name="MontoDeuda"
              value={MontoDeuda}
              disabled
            />
          </div>
        </div>

        <div className="field mb-3">
          <label
            htmlFor="id_employee"
            className="text-[#003462] font-black text-sm mb-3"
          >
            ID Empleado
          </label>
          <div className="card flex justify-content-center">
            <Dropdown
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.value)}
              options={optionSeller}
              optionLabel="name"
              editable
              placeholder="Selecciona un empleado"
              className="w-full md:w-14rem"
              required
            />
          </div>
        </div>

        <div className="field mb-3">
          <label
            htmlFor="payment_registration_date"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Fecha de Registro de Pago
          </label>
          <Calendar
            id="payment_registration_date"
            name="payment_registration_date"
            value={formData.payment_registration_date}
            onChange={(e) => handleDateChange(e, "payment_registration_date")}
            placeholder="Seleccione la fecha de pago"
            className={classNames({
              "p-invalid": submitted && !formData.payment_registration_date,
            })}
          />
          {submitted && !formData.payment_registration_date && (
            <Message
              className="small-message"
              severity="error"
              text="Fecha de pago es requerida"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="description"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Descripción
          </label>
          <InputText
            placeholder="Ingrese la descripción"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.description,
            })}
          />
          {submitted && !formData.description && (
            <Message
              className="small-message"
              severity="error"
              text="Descripción es requerida"
            />
          )}
        </div>

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
              text="Monto de pago es requerido"
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
