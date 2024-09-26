import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { getAllProfiles } from "@/infraestructure/useCasesNav/Client/getClientUseCase";

export default function BankTransactionForm() {
  const [formData, setFormData] = useState({
    receipt_number: "",
    transaction_date: new Date(),
    id_user_delivery: 1,
    id_user_receive: "",
    receipt_type: "",
    total_amount: "",
    description: "",
  });

  useEffect(() => {
    async function fetchProfiles() {
      const options = await getAllProfiles();
      console.log(options);
      setOptionProfiles(options);
    }
    fetchProfiles();
  }, []);
  const TipoPago = [
    { label: "VOUCHER", value: "VOUCHER" },
    { label: "RECIBO", value: "RECIBO" },
    { label: "CONSTANCIA DE DEPOSITO", value: "CONSTANCIA DE DEPOSITO" },
    {
      label: "COMPROBANTE DE ENTREGA EFECTIVO",
      value: "COMPROBANTE DE ENTREGA EFECTIVO",
    },
    {
      label: "TRASNFERENCIA DE CLIENTE A DISTRIBUIDOR",
      value: "TRASNFERENCIA DE CLIENTE A DISTRIBUIDOR",
    },
    { label: "OTROS", value: "OTROS" },
  ];

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optionProfiles, setOptionProfiles] = useState([]);
  const toast = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (e) => {
    setFormData({ ...formData, transaction_date: e.value });
  };

  const handleDropdownChange = (e, name) => {
    setFormData({ ...formData, [name]: e.value });
  };

  const submitForm = async () => {
    setSubmitted(true);
    if (
      !formData.receipt_number ||
      !formData.transaction_date ||
      !formData.total_amount ||
      !formData.id_user_receive
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor complete todos los campos requeridos",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/report/saveBankTransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_date: formData.transaction_date,
          id_user_delivery: 1,
          id_user_receive: formData.id_user_receive,
          receipt_number: formData.receipt_number,
          receipt_type: formData.receipt_type,
          total_amount: formData.total_amount,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        toast.current?.show({
          severity: "success",
          summary: "Transacción Registrada",
          detail: "La transacción ha sido registrada correctamente",
          life: 3000,
        });
        setFormData({
          receipt_number: "",
          transaction_date: new Date(),
          id_user_delivery: "",
          id_user_receive: "",
          receipt_type: "",
          total_amount: "",
          description: "",
        });
        setLoading(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error de conexión",
          detail: "No se pudo registrar la transacción",
          life: 3000,
        });
        throw new Error("Error en la solicitud");
      }
    } catch (error) {
      setLoading(false);
      toast.current.show({
        severity: "error",
        summary: "Error de conexión",
        detail: "No se pudo registrar la transacción",
        life: 3000,
      });
    }
  };

  return (
    <div className="card w-4/5 m-auto">
      <Toast ref={toast} />
      <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
        <div className="field mb-3">
          <label
            htmlFor="transaction_date"
            className="block text-[#003462] font-black text-sm mb-2"
          >
            Fecha de Transacción
          </label>
          <Calendar
            id="transaction_date"
            name="transaction_date"
            value={formData.transaction_date}
            onChange={handleDateChange}
            showIcon
            required
          />
        </div>

        <div className="field mb-3">
          <label
            htmlFor="id_user_receive"
            className="block text-[#003462] font-black text-sm mb-2"
          >
            Usuario que Recepciona
          </label>
          <Dropdown
            id="id_user_receive"
            name="id_user_receive"
            value={formData.id_user_receive}
            options={optionProfiles}
            onChange={(e) => handleDropdownChange(e, "id_user_receive")}
            placeholder="Seleccione un Tipo de Documento"
            className={classNames({
              "p-invalid": submitted && !formData.id_user_receive,
            })}
          />
        </div>

        <div className="field mb-3">
          <label
            htmlFor="receipt_number"
            className="block text-[#003462] font-black text-sm mb-2"
          >
            N° Recibo
          </label>
          <InputText
            id="receipt_number"
            name="receipt_number"
            value={formData.receipt_number}
            onChange={handleInputChange}
          />
        </div>
        <div className="field mb-3">
          <label
            htmlFor="receipt_number"
            className="block text-[#003462] font-black text-sm mb-2"
          >
            Tipo de Documento
          </label>
          <Dropdown
            id="receipt_type"
            name="receipt_type"
            value={formData.receipt_type}
            options={TipoPago}
            onChange={(e) => handleDropdownChange(e, "receipt_type")}
            placeholder="Seleccione un Tipo de Documento"
            className={classNames({
              "p-invalid": submitted && !formData.receipt_type,
            })}
          />
        </div>

        <div className="field mb-3">
          <label
            htmlFor="total_amount"
            className="block text-[#003462] font-black text-sm mb-2"
          >
            Monto Total
          </label>
          <InputText
            id="total_amount"
            name="total_amount"
            type="number"
            value={formData.total_amount}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="field mb-3">
          <label
            htmlFor="description"
            className="block text-[#003462] font-black text-sm mb-2"
          >
            Descripción
          </label>
          <InputText
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <Button
          label="Registrar Transacción"
          onClick={submitForm}
          icon="pi pi-check"
          loading={loading}
        />
      </form>
    </div>
  );
}
