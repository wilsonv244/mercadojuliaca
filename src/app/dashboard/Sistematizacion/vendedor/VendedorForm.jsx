import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";

export default function VendedorForm() {
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    telefono1: "",
    telefono2: "",
    canal: null,
    estatus: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const canales = [
    { label: "Tradicional", value: "tradicional" },
    { label: "Mayorista", value: "mayorista" },
    { label: "Provincia", value: "provincia" },
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
      formData.telefono1 &&
      formData.canal &&
      formData.estatus
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
      <form onSubmit={handleSubmit} className="p-fluid">
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
          {submitted && !formData.nombre && (
            <Message
              className="small-message"
              severity="error"
              text="Número de DNI es requerido"
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

        <Button label="Guardar" icon="pi pi-check" type="submit" />
      </form>
    </div>
  );
}
