import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { classNames } from "primereact/utils";
import "../client/ClienteForm.css";

export default function ProveedorForm() {
  const [formData, setFormData] = useState({
    ruc: "",
    nombre: "",
    razonSocial: "",
    telefono1: "",
    telefono2: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    setSubmitted(true);
    return (
      formData.ruc &&
      formData.nombre &&
      formData.razonSocial &&
      formData.telefono1
    );
  };

  const submitForm = async () => {
    if (validateForm()) {
      try {
        const response = await fetch("/api/supplier/saveSupplier", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_entity: 1, // Cambia según el id_entity necesario
            ruc: formData.ruc,
            supplier_name: formData.nombre,
            legal_name: formData.razonSocial,
            phone_number: formData.telefono1,
            phone_number2: formData.telefono2 || null,
          }),
        });

        if (response.ok) {
          toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Proveedor registrado correctamente",
          });
          resetForm(); // Limpiar el formulario tras la operación exitosa
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Error al registrar el proveedor",
          });
        }
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error de conexión con el servidor",
        });
      }
    }
  };

  // Confirmación antes de guardar
  const confirmSubmit = () => {
    confirmDialog({
      message: "¿Estás seguro de que deseas guardar este proveedor?",
      header: "Confirmación de Guardado",
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
      ruc: "",
      nombre: "",
      razonSocial: "",
      telefono1: "",
      telefono2: "",
    });
    setSubmitted(false);
  };

  return (
    <div className="card w-10/12 m-auto">
      <Toast ref={toast} />
      <ConfirmDialog />
      <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
        <div className="field mb-3">
          <label
            htmlFor="ruc"
            className="text-[#003462] font-black text-sm mb-3"
          >
            RUC
          </label>
          <InputText
            placeholder="Ingrese el RUC"
            id="ruc"
            name="ruc"
            maxLength={11}
            value={formData.ruc}
            onChange={handleInputChange}
            className={classNames({ "p-invalid": submitted && !formData.ruc })}
          />
          {submitted && !formData.ruc && (
            <Message
              className="small-message"
              severity="error"
              text="RUC es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="nombre"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Nombre Proveedor
          </label>
          <InputText
            id="nombre"
            placeholder="Ingrese el nombre del proveedor"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.nombre,
            })}
          />
          {submitted && !formData.nombre && (
            <Message
              className="small-message"
              severity="error"
              text="Nombre del proveedor es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="razonSocial"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Razón Social
          </label>
          <InputText
            id="razonSocial"
            placeholder="Ingrese la razón social"
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.razonSocial,
            })}
          />
          {submitted && !formData.razonSocial && (
            <Message
              className="small-message"
              severity="error"
              text="Razón Social es requerida"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="telefono1"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Teléfono 1
          </label>
          <InputText
            id="telefono1"
            name="telefono1"
            placeholder="Ingrese el número de teléfono"
            value={formData.telefono1}
            maxLength={9}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.telefono1,
            })}
          />
          {submitted && !formData.telefono1 && (
            <Message
              className="small-message"
              severity="error"
              text="Teléfono 1 es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="telefono2"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Teléfono 2
          </label>
          <InputText
            maxLength={9}
            id="telefono2"
            placeholder="Ingrese el segundo número de teléfono"
            name="telefono2"
            value={formData.telefono2}
            onChange={handleInputChange}
          />
        </div>

        <Button
          label="Guardar"
          icon="pi pi-check"
          type="button"
          onClick={confirmSubmit} // Mostrar el diálogo de confirmación
        />
      </form>
    </div>
  );
}
