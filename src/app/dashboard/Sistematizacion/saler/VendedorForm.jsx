import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function VendedorForm() {
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    apellido: "", // Añadido para apellido
    telefono1: "",
    telefono2: "",
    direccion: "",
    canal: null,
    estatus: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null); // Referencia para Toast

  const canales = [
    { label: "Tradicional", value: 1 },
    { label: "Mayorista", value: 2 },
    { label: "Provincia", value: 3 },
  ];

  const estatus = [
    { label: "ACTIVO", value: "activo" },
    { label: "INACTIVO", value: "inactivo" },
  ];

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
      formData.dni &&
      formData.nombre &&
      formData.apellido &&
      formData.telefono1 &&
      formData.canal &&
      formData.estatus
    );
  };

  const resetForm = () => {
    setFormData({
      dni: "",
      nombre: "",
      apellido: "",
      telefono1: "",
      telefono2: "",
      canal: null,
      estatus: null,
    });
    setSubmitted(false);
  };

  const submitForm = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch("/api/saler/saveSaler", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            document_number: formData.dni,
            first_name: formData.nombre,
            last_name: formData.apellido,
            phone_number: formData.telefono1,
            phone_number2: formData.telefono2 || null,
            canal: formData.canal,
            direccion: formData.direccion,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Vendedor registrado correctamente",
          });
          resetForm(); // Limpia el formulario después de registrar
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Error al registrar el vendedor",
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
      message: "¿Estás seguro de que deseas guardar el vendedor?",
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

  return (
    <div className="card w-10/12 m-auto">
      <Toast ref={toast} />
      <ConfirmDialog />

      <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
        <div className="field mb-3">
          <label
            htmlFor="dni"
            className="text-[#003462] font-black text-sm mb-3"
          >
            DNI
          </label>
          <InputText
            placeholder="Ingrese su Número de DNI"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
            className={classNames({ "p-invalid": submitted && !formData.dni })}
          />
          {submitted && !formData.dni && (
            <Message
              className="small-message"
              severity="error"
              text="DNI es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="nombre"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Nombre
          </label>
          <InputText
            id="nombre"
            placeholder="Ingrese su nombre"
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
              text="Nombre es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="apellido"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Apellido
          </label>
          <InputText
            id="apellido"
            placeholder="Ingrese su apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.apellido,
            })}
          />
          {submitted && !formData.apellido && (
            <Message
              className="small-message"
              severity="error"
              text="Apellido es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="telefono1"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Telefono 1
          </label>
          <InputText
            id="telefono1"
            name="telefono1"
            placeholder="Ingrese su número de Telefono"
            value={formData.telefono1}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid m-3": submitted && !formData.telefono1,
            })}
          />
          {submitted && !formData.telefono1 && (
            <Message
              className="small-message"
              severity="error"
              text="Telefono 1 es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="telefono2"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Telefono 2
          </label>
          <InputText
            id="telefono2"
            placeholder="Ingrese su segundo número de Telefono"
            name="telefono2"
            value={formData.telefono2}
            onChange={handleInputChange}
          />
        </div>
        <div className="field mb-3">
          <label
            htmlFor="direccion"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Dirección
          </label>
          <InputText
            id="direccion"
            placeholder="Ingrese su dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
          />
        </div>

        <div className="field mb-3">
          <label
            htmlFor="canal"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Canal
          </label>
          <Dropdown
            id="canal"
            name="canal"
            value={formData.canal}
            options={canales}
            onChange={(e) => handleDropdownChange(e, "canal")}
            placeholder="Seleccione un canal"
            className={classNames({
              "p-invalid": submitted && !formData.canal,
            })}
          />
          {submitted && !formData.canal && (
            <Message
              className="small-message"
              severity="error"
              text="Canal es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="estatus"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Estatus
          </label>
          <Dropdown
            id="estatus"
            name="estatus"
            value={formData.estatus}
            options={estatus}
            onChange={(e) => handleDropdownChange(e, "estatus")}
            placeholder="Seleccione estatus"
            className={classNames({
              "p-invalid": submitted && !formData.estatus,
            })}
          />
          {submitted && !formData.estatus && (
            <Message
              className="small-message"
              severity="error"
              text="Estatus es requerido"
            />
          )}
        </div>

        <Button
          label={loading ? "Guardando..." : "Guardar"}
          icon="pi pi-check"
          type="button"
          onClick={confirmSubmit}
          disabled={loading}
        />
      </form>
    </div>
  );
}
