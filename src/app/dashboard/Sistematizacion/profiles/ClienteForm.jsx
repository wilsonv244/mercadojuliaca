import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";

export default function ClienteForm() {
  const [formData, setFormData] = useState({
    dni: "",
    ruc: "",
    nombre: "",
    razonSocial: "",
    telefono1: "",
    telefono2: "",
    canal: null,
    zona: "",
    direccion: "",
    provincia: "",
    distrito: "",
    fechaInicio: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const canales = [
    { label: "Tradicional", value: "tradicional" },
    { label: "Mayorista", value: "mayorista" },
    { label: "Provincia", value: "provincia" },
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
      formData.ruc &&
      formData.nombre &&
      formData.razonSocial &&
      formData.telefono1 &&
      formData.canal &&
      formData.zona &&
      formData.direccion &&
      formData.provincia &&
      formData.distrito &&
      formData.fechaInicio
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
    <div className="card w-10/12 m-auto bg-amber-1 p-5 shadow-xl">
      <form onSubmit={handleSubmit} className="p-fluid">
        <div className="field mb-3">
          <label htmlFor="dni">DNI</label>
          <InputText
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
            className={classNames({ "p-invalid": submitted && !formData.dni })}
          />
          {submitted && !formData.dni && (
            <Message severity="error" text="DNI es requerido" />
          )}
        </div>

        <div className="field mb-3">
          <label htmlFor="ruc">RUC</label>
          <InputText
            id="ruc"
            name="ruc"
            value={formData.ruc}
            onChange={handleInputChange}
            className={classNames({ "p-invalid": submitted && !formData.ruc })}
          />
          {submitted && !formData.ruc && (
            <Message severity="error" text="RUC es requerido" />
          )}
        </div>

        <div className="field mb-3">
          <label htmlFor="nombre">Nombre</label>
          <InputText
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.nombre,
            })}
          />
          {submitted && !formData.nombre && (
            <Message severity="error" text="Nombre es requerido" />
          )}
        </div>

        <div className="field mb-3">
          <label htmlFor="razonSocial">Razón Social</label>
          <InputText
            id="razonSocial"
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.razonSocial,
            })}
          />
          {submitted && !formData.razonSocial && (
            <Message severity="error" text="Razón Social es requerida" />
          )}
        </div>

        <div className="p-field flex justify-between mb-3">
          <div className="p-field w-3/6">
            <label htmlFor="telefono1">Telefono 1</label>
            <InputText
              id="telefono1"
              name="telefono1"
              value={formData.telefono1}
              onChange={handleInputChange}
              className={classNames({
                "p-invalid": submitted && !formData.telefono1,
              })}
            />
            {submitted && !formData.telefono1 && (
              <Message severity="error" text="Telefono 1 es requerido" />
            )}
          </div>
          <div className="p-field w-5/12">
            <label htmlFor="telefono2">Telefono 2</label>
            <InputText
              id="telefono2"
              name="telefono2"
              value={formData.telefono2}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="p-field flex justify-between mb-3">
          <div className="p-field w-3/6">
            <label htmlFor="canal">Canal</label>
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
              <Message severity="error" text="Canal es requerido" />
            )}
          </div>
          <div className="p-field w-5/12">
            <label htmlFor="zona">Zona</label>
            <InputText
              id="zona"
              name="zona"
              value={formData.zona}
              onChange={handleInputChange}
              className={classNames({
                "p-invalid": submitted && !formData.zona,
              })}
            />
            {submitted && !formData.zona && (
              <Message severity="error" text="Zona es requerida" />
            )}
          </div>
        </div>

        <div className="field mb-3">
          <label htmlFor="direccion">Dirección</label>
          <InputText
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.direccion,
            })}
          />
          {submitted && !formData.direccion && (
            <Message severity="error" text="Dirección es requerida" />
          )}
        </div>

        <div className="field mb-3">
          <label htmlFor="provincia">Provincia</label>
          <InputText
            id="provincia"
            name="provincia"
            value={formData.provincia}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.provincia,
            })}
          />
          {submitted && !formData.provincia && (
            <Message severity="error" text="Provincia es requerida" />
          )}
        </div>

        <div className="field mb-3">
          <label htmlFor="distrito">Distrito</label>
          <InputText
            id="distrito"
            name="distrito"
            value={formData.distrito}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.distrito,
            })}
          />
          {submitted && !formData.distrito && (
            <Message severity="error" text="Distrito es requerido" />
          )}
        </div>

        <div className="field mb-3">
          <label htmlFor="fechaInicio">Fecha Inicio</label>
          <Calendar
            id="fechaInicio"
            name="fechaInicio"
            value={formData.fechaInicio}
            onChange={(e) => handleDropdownChange(e, "fechaInicio")}
            placeholder="Seleccione una fecha"
            className={classNames({
              "p-invalid": submitted && !formData.fechaInicio,
            })}
          />
          {submitted && !formData.fechaInicio && (
            <Message severity="error" text="Fecha Inicio es requerida" />
          )}
        </div>

        <Button
          label="Guardar"
          icon="pi pi-check"
          type="submit"
          className="mb-5"
        />
      </form>
    </div>
  );
}
