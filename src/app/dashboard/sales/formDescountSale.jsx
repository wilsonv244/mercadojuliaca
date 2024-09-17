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

export default function DescountSaleForm() {
  const [formData, setFormData] = useState({
    id_sale: "",
    id_employee: "",
    payment_registration_date: null,
    description: "",
    payment_amount: "",
    is_credit_note: false,
  });

  const [ventaData, setVentaData] = useState({});

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optionSeller, setOptionSeller] = useState([]);
  const toast = useRef(null);

  useEffect(() => {
    async function fetchEmployees() {
      const options = await getEmployeeFormSaler();
      setOptionSeller(options);
    }
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = (value, name) => {
    console.log(value.name);
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (e, name) => {
    setFormData({ ...formData, [name]: e.value });
  };

  const validateForm = () => {
    setSubmitted(true);
    return (
      formData.id_employee &&
      formData.payment_registration_date &&
      formData.description &&
      formData.payment_amount
    );
  };

  const llamarApiVenta = async () => {
    try {
      const responseSalePayment = await getSaleByReceiptNumber(
        formData.id_sale
      );
      if (responseSalePayment.statusCode !== 200) {
        toast.current.show({
          severity: "info",
          summary: "Cancelado",
          detail: "No se encontró datos con ese recibo",
        });
        setVentaData({});
        return;
      }
      setVentaData(responseSalePayment);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al buscar la venta",
      });
    }
  };

  const submitForm = async () => {
    console.log("formData");
    console.log(formData);
    if (validateForm()) {
      const idEmpleado = Number(formData.id_employee.code);
      console.log(idEmpleado);
      setLoading(true);
      try {
        console.log("entrando");
        const response = await fetch("/api/payment/savePayment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_credit_note: true,
            id_sale: idSaleVenta,
            id_employee: idEmpleado,
            payment_registration_date: formData.payment_registration_date,
            description: formData.description,
            payment_amount: formData.payment_amount,
          }),
        });

        const result = await response.json();
        console.log(result);
        if (response.ok) {
          toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Nota de venta registrado correctamente",
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
        console.log(error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error de conexión con el servidor",
        });
      } finally {
        console.log("no ingresa");
        setLoading(false);
      }
    } else {
      console.log("no ingresa");
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

  const resetForm = () => {
    setFormData({
      id_sale: "",
      id_employee: "",
      payment_registration_date: null,
      description: "",
      payment_amount: "",
    });
    setMontoTotal(0);
    setMontoDeuda(0);
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
          {submitted && !formData.id_sale && (
            <Message
              className="small-message"
              severity="error"
              text="ID Venta es requerido"
            />
          )}
        </div>
        <div
          className={`flex justify-between gap-2  p-3 rounded-lg ${
            ventaData.statusCode !== 200 ? "bg-red-50" : "bg-green-50"
          }`}
        >
          <div className="field mb-3">
            <label
              htmlFor="MontoTotal"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Monto Total
            </label>
            <InputText
              placeholder="Monto Total"
              id="MontoTotal"
              disabled
              name="MontoTotal"
              value={ventaData.total_amount || 0}
            />
          </div>
          <div className="field mb-3">
            <label
              htmlFor="MontoDeuda"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Monto Deuda
            </label>
            <InputText
              type="number"
              placeholder="Monto Deuda"
              id="MontoDeuda"
              name="MontoDeuda"
              value={ventaData.deuda_total || ""}
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
              value={formData.id_employee}
              onChange={(e) => handleDropdownChange(e.value, "id_employee")}
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
