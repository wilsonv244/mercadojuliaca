import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";

export default function ProveedorForm() {
  const [formData, setFormData] = useState({
    ruc: "",
    nombre: "",
    razonSocial: "",
    telefono1: "",
    telefono2: "",
  });

  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Aquí iría la lógica para enviar el formulario
    }
  };

  return (
    <div className="card w-2/3 m-auto">
      <h2 className="text-center mb-4 text-[#003462] font-black">
        Crear nuevo proveedor
      </h2>
      <form onSubmit={handleSubmit} className="p-fluid">
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
            id="telefono2"
            placeholder="Ingrese el segundo número de teléfono"
            name="telefono2"
            value={formData.telefono2}
            onChange={handleInputChange}
          />
        </div>

        <Button label="Guardar" icon="pi pi-check" type="submit" />
      </form>
    </div>
  );
}
