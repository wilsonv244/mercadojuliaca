import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { getEmployeeFormSaler } from "@/infraestructure/useCasesNav/Client/getEmployeeUseCase";
import { getPurchaseById } from "@/infraestructure/useCasesNav/purchase/getPurchaseReqById";
import { set } from "date-fns";
import { calcularIgv } from "@/domain/utils/Amount";

export default function PurchaseOrderForm() {
  const [formData, setFormData] = useState({
    id_request: "",
    id_supplier: "",
    order_date: null,
    total_amount: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [requests, setRequests] = useState({});
  const [montoSinIgv, setMontoSinIgv] = useState(0);
  const toast = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const supplierOptions = await getEmployeeFormSaler();
      setSuppliers(supplierOptions);
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    console.log(name);
    if (name == "total_amount") {
      setMontoSinIgv((value - calcularIgv(value)).toFixed(2));
    }
    console.log(value);
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (e, name) => {
    setFormData({ ...formData, [name]: e.value });
  };

  const handleDropdownChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    setSubmitted(true);
    return (
      formData.id_request &&
      formData.id_supplier &&
      formData.order_date &&
      formData.total_amount
    );
  };

  const submitForm = async () => {
    if (validateForm()) {
      formData.id_supplier = formData.id_supplier.code;
      setLoading(true);
      try {
        const response = await fetch("/api/purchase/savePurchaseOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          toast.current.show({
            severity: "success",
            summary: "Éxito",
            detail: "Orden de compra registrada correctamente",
          });
          resetForm(); // Limpiar formulario tras la operación exitosa
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Error al registrar la orden de compra",
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

  const llamarApiVenta = async () => {
    const apiPurchaseId = await getPurchaseById(formData.id_request);
    setRequests(apiPurchaseId);
  };

  const confirmSubmit = () => {
    confirmDialog({
      message: "¿Estás seguro de que deseas registrar esta orden de compra?",
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
      id_request: "",
      id_supplier: "",
      order_date: null,
      total_amount: "",
    });
    setRequests({});
    setSubmitted(false);
  };

  return (
    <div className="card w-4/5 m-auto">
      <Toast ref={toast} />
      <ConfirmDialog />

      <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
        <div className="field mb-3">
          <label
            htmlFor="id_request"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Solicitud de Compra
          </label>
          <div className="flex justify-between">
            <InputText
              value={formData.id_request}
              placeholder="Seleccione una solicitud de compra"
              name="id_request"
              onChange={handleInputChange}
              className={classNames({
                "p-invalid": submitted && !formData.id_request,
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
          {submitted && !formData.id_request && (
            <Message
              className="small-message"
              severity="error"
              text="Solicitud de compra es requerida"
            />
          )}
        </div>
        <div
          className={` p-3 ${
            requests.status_code !== 200 ? "bg-red-50" : "bg-green-50"
          }`}
        >
          <div className="flex justify-between gap-2">
            <div className="field w-full">
              <label
                htmlFor="item"
                className="text-[#003462] font-black text-sm mb-3"
              >
                Artículo
              </label>
              <InputText
                id="item"
                disabled
                name="item"
                value={requests.item || ""}
                placeholder="Descripción del artículo"
              />
            </div>
            <div className="field w-full">
              <label
                htmlFor="quantity"
                className="text-[#003462] font-black text-sm mb-3"
              >
                Cantidad
              </label>
              <InputText
                id="quantity"
                name="quantity"
                disabled
                value={requests.quantity || ""}
                placeholder="Cantidad del artículo"
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="field w-full">
              <label
                htmlFor="unit_of_measurement"
                className="text-[#003462] font-black text-sm mb-3"
              >
                Unidad de Medida
              </label>
              <InputText
                id="unit_of_measurement"
                disabled
                name="unit_of_measurement"
                value={requests.unit_of_measurement || ""}
                placeholder="Unidad de medida"
              />
            </div>
            <div className="field w-full">
              <label
                htmlFor="planned_cost"
                className="text-[#003462] font-black text-sm mb-3"
              >
                Costo Planeado
              </label>
              <InputText
                id="planned_cost"
                disabled
                name="planned_cost"
                value={requests.planned_cost || ""}
                placeholder="Costo Planeado"
              />
            </div>
          </div>
        </div>

        <div className="field mb-3">
          <label
            htmlFor="id_supplier"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Proveedor
          </label>
          <Dropdown
            value={formData.id_supplier}
            onChange={(e) => handleDropdownChange(e.value, "id_supplier")}
            options={suppliers}
            optionLabel="name"
            placeholder="Selecciona un proveedor"
            className="w-full md:w-14rem"
          />
          {submitted && !formData.id_supplier && (
            <Message
              className="small-message"
              severity="error"
              text="Proveedor es requerido"
            />
          )}
        </div>

        <div className="field mb-3">
          <label
            htmlFor="order_date"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Fecha de la Orden
          </label>
          <Calendar
            id="order_date"
            name="order_date"
            value={formData.order_date}
            onChange={(e) => handleDateChange(e, "order_date")}
            placeholder="Seleccione la fecha de la orden"
            className={classNames({
              "p-invalid": submitted && !formData.order_date,
            })}
          />
          {submitted && !formData.order_date && (
            <Message
              className="small-message"
              severity="error"
              text="Fecha de la orden es requerida"
            />
          )}
        </div>

        <div className="flex justify-between gap-3">
          <div className="field mb-3 w-full">
            <label
              htmlFor="total_amount"
              className="text-[#003462] font-black text-sm mb-3"
            >
              Monto Total
            </label>
            <InputText
              placeholder="Ingrese el monto total"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleInputChange}
              className={classNames({
                "p-invalid": submitted && !formData.total_amount,
              })}
            />
            {submitted && !formData.total_amount && (
              <Message
                className="small-message"
                severity="error"
                text="Monto total es requerido"
              />
            )}
          </div>
          <div className="field mb-3 w-full">
            <label
              htmlFor="total_amount"
              className="text-[#b81a5f] font-black text-sm mb-3"
            >
              Monto Total sin IGV
            </label>
            <InputText
              disabled
              placeholder="Monto sin IGV"
              name="total_amount_withouth_igv"
              value={montoSinIgv}
              onChange={handleInputChange}
              className={classNames({
                "p-invalid": submitted && !formData.total_amount,
              })}
            />
          </div>
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
