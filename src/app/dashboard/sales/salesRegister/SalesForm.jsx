import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { getAllClientForm } from "@/infraestructure/useCasesNav/Client/getClientUseCase";
import { getEmployeeFormSaler } from "@/infraestructure/useCasesNav/Client/getEmployeeUseCase";
import { calcularIgv, MontoConIgv } from "@/domain/utils/Amount";
import { TipoComprobante } from "../../tools/TypeTables";

export default function IngresoVentasForm() {
  const [formData, setFormData] = useState({
    idCliente: "",
    idVendedor: "",
    montoTotal: "",
    tipoComprobante: "",
    nroComprobante: "",
    status: true,
  });

  const toast = useRef(null); // Referencia para Toast
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [optionClient, setOptionClient] = useState([]);
  const [optionSeller, setOptionSeller] = useState([]);
  const [montoIgv, setMontoIgv] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const optionsClient = await getAllClientForm();
      const optionsSaler = await getEmployeeFormSaler();
      setOptionClient(optionsClient);
      setOptionSeller(optionsSaler);
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name == "montoTotal") {
      setMontoIgv((value - calcularIgv(value)).toFixed(2));
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleDropdownChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    setSubmitted(true);
    return (
      formData.idCliente &&
      formData.idVendedor &&
      formData.tipoComprobante &&
      formData.nroComprobante
    );
  };

  const submitForm = async () => {
    console.log(formData.idCliente["code"]);
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch("/api/sale/saveSale", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_employee: parseInt(formData.idVendedor["code"]),
            id_client: parseInt(formData.idCliente["code"]),
            receipt_type: formData.tipoComprobante,
            receipt_number: formData.nroComprobante,
            total_amount: parseFloat(formData.montoTotal),
            status: formData.status,
          }),
        });

        const result = await response.json();
        console.log(result);
        if (response.ok) {
          toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: `Venta registrada correctamente con el Nro Comprobante: ${result.receipt_number}`,
          });
          resetForm();
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Error al registrar la venta",
          });
        }
      } catch (error) {
        console.error("Error:", error);
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

  const resetForm = () => {
    setFormData({
      idCliente: "",
      idVendedor: "",
      montoTotal: "",
      tipoComprobante: "",
      nroComprobante: "",
      status: true,
    });
    setSubmitted(false);
  };

  const confirmSubmit = () => {
    confirmDialog({
      message: "¿Estás seguro de que deseas guardar esta venta?",
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
    <div className="card w-4/5 m-auto">
      <Toast ref={toast} />
      <ConfirmDialog />

      <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
        {/* Id Cliente */}
        <div className="field mb-3">
          <label
            htmlFor="idCliente"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Razon social del cliente
          </label>
          <Dropdown
            value={formData.idCliente}
            onChange={(e) => handleDropdownChange(e.value, "idCliente")}
            options={optionClient}
            optionLabel="name"
            placeholder="Selecciona un cliente"
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

        {/* Id Vendedor */}
        <div className="field mb-3">
          <label
            htmlFor="idVendedor"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Nombre del Vendedor
          </label>
          <Dropdown
            value={formData.idVendedor}
            onChange={(e) => handleDropdownChange(e.value, "idVendedor")}
            options={optionSeller}
            optionLabel="name"
            placeholder="Selecciona un vendedor"
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

        {/* Monto Total */}
        <div className="flex justify-between gap-3">
          <div className="field mb-3 w-full">
            <label
              htmlFor="montoTotal"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Monto Total incluye IGV
            </label>
            <InputText
              type="number"
              id="montoTotal"
              name="montoTotal"
              value={formData.montoTotal}
              onChange={handleInputChange}
              placeholder="Ingrese el monto de la operación"
              className={classNames({
                "p-invalid": submitted && !formData.montoTotal,
              })}
            />
          </div>
          <div className="field mb-3 w-full">
            <label
              htmlFor="nroComprobante"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Monto sin IGV
            </label>
            <InputText
              disabled
              placeholder="Monto sin IGV"
              name="nroComprobante"
              value={montoIgv}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Tipo de Comprobante */}
        <div className="field mb-3">
          <label
            htmlFor="tipoComprobante"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Tipo Comprobante
          </label>
          <Dropdown
            id="tipoComprobante"
            placeholder="Ingrese el tipo de comprobante"
            name="tipoComprobante"
            options={TipoComprobante}
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

        {/* Número de Comprobante */}
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
