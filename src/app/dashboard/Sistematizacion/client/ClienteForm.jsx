import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import "./ClienteForm.css";

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

  const toast = useRef(null); // Referencia para el Toast
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
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
    setSubmitted(false);
  };
  const canales = [
    { label: "Tradicional", value: "tradicional" },
    { label: "Mayorista", value: "mayorista" },
    { label: "Provincia", value: "provincia" },
  ];

  const provinciasPuno = [
    { label: "Puno", value: "puno" },
    { label: "Azángaro", value: "azangaro" },
    { label: "Carabaya", value: "carabaya" },
    { label: "Chucuito", value: "chucuito" },
    { label: "El Collao", value: "el_collao" }, // Nota: Se usa guion bajo para espacios en el value
    { label: "Huancané", value: "huancane" },
    { label: "Lampa", value: "lampa" },
    { label: "Melgar", value: "melgar" },
    { label: "Moho", value: "moho" },
    { label: "San Antonio de Putina", value: "san_antonio_de_putina" },
    { label: "San Román", value: "san_roman" },
    { label: "Sandia", value: "sandia" },
    { label: "Yunguyo", value: "yunguyu" },
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

  const submitForm = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch("/api/client/saveClient", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_entity: 1,
            id_channel: 1,
            document_type: 1,
            document_number: formData.dni,
            person_type: 1,
            last_name: formData.razonSocial,
            first_name: formData.nombre,
            phone_number: formData.telefono1,
            phone_number2: formData.telefono2 || null,
            zone: formData.zona,
            address: formData.direccion,
            province: formData.provincia,
            district: formData.distrito,
            created_at: new Date(),
            updated_at: new Date(),
          }),
        });

        const result = await response.json();
        console.log(result);
        if (response.ok) {
          toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Cliente registrado correctamente",
          });
          resetForm();
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Error al registrar el cliente",
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

  //Confirmar antes de guardar
  const confirmSubmit = () => {
    confirmDialog({
      message: "¿Estás seguro de que deseas guardar el cliente?",
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
    <div className="card w-10/12 m-auto bg-amber-1 p-5 shadow-xl">
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
            maxLength={8}
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
            htmlFor="ruc"
            className="text-[#003462] font-black text-sm mb-3"
          >
            RUC
          </label>
          <InputText
            placeholder="Ingrese su Número de RUC"
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
            Nombre
          </label>
          <InputText
            placeholder="Ingrese su Nombre"
            id="nombre"
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
            htmlFor="razonSocial"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Razón Social
          </label>
          <InputText
            placeholder="Ingrese la Razon social"
            id="razonSocial"
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

        <div className="p-field flex justify-between mb-3">
          <div className="p-field w-3/6">
            <label
              htmlFor="telefono1"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Telefono 1
            </label>
            <InputText
              placeholder="Ingrese su Primer telefono"
              id="telefono1"
              name="telefono1"
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
                text="Telefono 1 es requerido"
              />
            )}
          </div>
          <div className="p-field w-5/12">
            <label
              htmlFor="telefono2"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Telefono 2
            </label>
            <InputText
              placeholder="Ingrese su segundo telefono"
              id="telefono2"
              name="telefono2"
              value={formData.telefono2}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="p-field flex justify-between mb-3">
          <div className="p-field w-3/6">
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
          <div className="p-field w-5/12">
            <label
              htmlFor="zona"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Zona
            </label>
            <InputText
              placeholder="Ingrese su Zona de residencia"
              id="zona"
              name="zona"
              value={formData.zona}
              onChange={handleInputChange}
              className={classNames({
                "p-invalid": submitted && !formData.zona,
              })}
            />
            {submitted && !formData.zona && (
              <Message
                className="small-message"
                severity="error"
                text="Zona es requerida"
              />
            )}
          </div>
        </div>

        <div className="field mb-3">
          <label
            htmlFor="direccion"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Dirección
          </label>
          <InputText
            placeholder="Ingrese su dirección"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.direccion,
            })}
          />
          {submitted && !formData.direccion && (
            <Message
              className="small-message"
              severity="error"
              text="Dirección es requerida"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="provincia"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Provincia
          </label>

          <Dropdown
            id="provincia"
            name="provincia"
            value={formData.provincia}
            options={provinciasPuno}
            onChange={(e) => handleDropdownChange(e, "provincia")}
            placeholder="Seleccione un provincia"
            className={classNames({
              "p-invalid": submitted && !formData.provincia,
            })}
          />
          {submitted && !formData.provincia && (
            <Message
              className="small-message"
              severity="error"
              text="Canal es requerido"
            />
          )}

          {submitted && !formData.provincia && (
            <Message
              className="small-message"
              severity="error"
              text="Provincia es requerida"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="distrito"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Distrito
          </label>
          <InputText
            placeholder="Ingrese el distrito"
            id="distrito"
            name="distrito"
            value={formData.distrito}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.distrito,
            })}
          />
          {submitted && !formData.distrito && (
            <Message
              className="small-message"
              severity="error"
              text="Distrito es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="fechaInicio"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Fecha Inicio
          </label>
          <Calendar
            firstDayOfWeek
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
            <Message
              className="small-message"
              severity="error"
              text="Fecha Inicio es requerida"
            />
          )}
        </div>

        <Button
          label={loading ? "Guardando..." : "Guardar"}
          icon="pi pi-check"
          type="button"
          onClick={confirmSubmit} // Mostrar el diálogo de confirmación
          disabled={loading}
          className="mb-5"
        />
      </form>
    </div>
  );
}
