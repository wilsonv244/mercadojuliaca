import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";

export default function IngresoVentasForm() {
  const [formData, setFormData] = useState({
    fechaRegistro: "",
    idCliente: "",
    idVendedor: "",
    montoTotal: 1000,
    tipoComprobante: "",
    nroComprobante: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    setSubmitted(true);
    return (
      formData.fechaRegistro &&
      formData.idCliente &&
      formData.idVendedor &&
      formData.tipoComprobante &&
      formData.nroComprobante
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
            htmlFor="fechaRegistro"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Fecha de registro
          </label>
          <InputText
            placeholder="Ingrese la fecha de registro"
            id="fechaRegistro"
            name="fechaRegistro"
            value={formData.fechaRegistro}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.fechaRegistro,
            })}
          />
          {submitted && !formData.fechaRegistro && (
            <Message
              className="small-message"
              severity="error"
              text="Fecha de registro es requerida"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="idCliente"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Id Cliente
          </label>
          <InputText
            id="idCliente"
            placeholder="Ingrese el Id del cliente"
            name="idCliente"
            value={formData.idCliente}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.idCliente,
            })}
          />
          {submitted && !formData.idCliente && (
            <Message
              className="small-message"
              severity="error"
              text="Id Cliente es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="idVendedor"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Id Vendedor
          </label>
          <InputText
            id="idVendedor"
            placeholder="Ingrese el Id del vendedor"
            name="idVendedor"
            value={formData.idVendedor}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.idVendedor,
            })}
          />
          {submitted && !formData.idVendedor && (
            <Message
              className="small-message"
              severity="error"
              text="Id Vendedor es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="montoTotal"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Monto Total
          </label>
          <InputText
            id="montoTotal"
            name="montoTotal"
            value={formData.montoTotal}
            onChange={handleInputChange}
            disabled
          />
        </div>

        <div className="field mb-3">
          <label
            htmlFor="tipoComprobante"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Tipo Comprobante
          </label>
          <InputText
            id="tipoComprobante"
            placeholder="Ingrese el tipo de comprobante"
            name="tipoComprobante"
            value={formData.tipoComprobante}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.tipoComprobante,
            })}
          />
          {submitted && !formData.tipoComprobante && (
            <Message
              className="small-message"
              severity="error"
              text="Tipo Comprobante es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="nroComprobante"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Nro Comprobante
          </label>
          <InputText
            id="nroComprobante"
            placeholder="Ingrese el número de comprobante"
            name="nroComprobante"
            value={formData.nroComprobante}
            onChange={handleInputChange}
            className={classNames({
              "p-invalid": submitted && !formData.nroComprobante,
            })}
          />
          {submitted && !formData.nroComprobante && (
            <Message
              className="small-message"
              severity="error"
              text="Nro Comprobante es requerido"
            />
          )}
        </div>

        <Button label="Guardar" icon="pi pi-check" type="submit" />
      </form>
    </div>
  );
}
