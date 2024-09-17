import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { getCostCenter } from "@/infraestructure/useCasesNav/purchase/getCostCenter";

export default function PurchaseRequestForm() {
  const [formData, setFormData] = useState({
    id_cost_center: "",
    request_date: null,
    item: "",
    description: "",
    quantity: "",
    unit_of_measurement: "",
    planned_cost: "",
    is_approved: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null); // Toast reference
  const [optionCostCenter, setOptionCostCenter] = useState([]);

  useEffect(() => {
    async function fetchEmployees() {
      const options = await getCostCenter();
      setOptionCostCenter(options);
    }
    fetchEmployees();
  }, []);

  const unitsOfMeasurement = [
    { label: "Units", value: "units" },
    { label: "Kilograms", value: "kg" },
    { label: "Liters", value: "l" },
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
      Number(formData.id_cost_center) &&
      formData.request_date &&
      formData.item &&
      formData.description &&
      formData.quantity &&
      formData.unit_of_measurement &&
      formData.planned_cost
    );
  };

  const submitForm = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch("/api/purchase/savePurchase", {
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
            detail: "Solicitud de compra registrada correctamente",
          });
          resetForm(); // Clear the form after successful submission
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: result.error || "Error al registrar la solicitud de compra",
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

  const confirmSubmit = () => {
    confirmDialog({
      message:
        "¿Estás seguro de que deseas registrar esta solicitud de compra?",
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
      id_cost_center: "",
      request_date: null,
      item: "",
      description: "",
      quantity: "",
      unit_of_measurement: "",
      planned_cost: "",
    });
    setSubmitted(false);
  };

  return (
    <div className="card w-4/5 m-auto">
      <Toast ref={toast} />
      <ConfirmDialog />

      <form onSubmit={(e) => e.preventDefault()} className="p-fluid">
        {/* Cost Center */}
        <div className="field mb-3">
          <label
            htmlFor="id_cost_center"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Centro de Costo
          </label>
          <Dropdown
            value={formData.id_cost_center}
            onChange={(e) => handleDropdownChange(e, "id_cost_center")}
            options={optionCostCenter}
            placeholder="Seleccione un centro de costo"
            className={classNames({
              "p-invalid": submitted && !formData.id_cost_center,
            })}
          />
          {submitted && !formData.id_cost_center && (
            <Message
              className="small-message"
              severity="error"
              text="Centro de Costo es requerido"
            />
          )}
        </div>

        {/* Request Date */}
        <div className="field mb-3">
          <label
            htmlFor="request_date"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Fecha de Solicitud
          </label>
          <Calendar
            id="request_date"
            name="request_date"
            value={formData.request_date}
            onChange={(e) => handleDropdownChange(e, "request_date")}
            placeholder="Seleccione la fecha de solicitud"
            className={classNames({
              "p-invalid": submitted && !formData.request_date,
            })}
          />
          {submitted && !formData.request_date && (
            <Message
              className="small-message"
              severity="error"
              text="Fecha de solicitud es requerida"
            />
          )}
        </div>

        {/* Item */}
        <div className="field mb-3">
          <label
            htmlFor="item"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Artículo
          </label>
          <InputText
            id="item"
            name="item"
            value={formData.item}
            onChange={handleInputChange}
            placeholder="Ingrese el artículo"
            className={classNames({ "p-invalid": submitted && !formData.item })}
          />
          {submitted && !formData.item && (
            <Message
              className="small-message"
              severity="error"
              text="Artículo es requerido"
            />
          )}
        </div>

        {/* Description */}
        <div className="field mb-3">
          <label
            htmlFor="description"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Descripción
          </label>
          <InputText
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Ingrese la descripción"
            className={classNames({
              "p-invalid": submitted && !formData.description,
            })}
          />
          {submitted && !formData.description && (
            <Message
              className="small-message"
              severity="error"
              text="Descripción es requerida"
            />
          )}
        </div>

        {/* Quantity */}
        <div className="field mb-3">
          <label
            htmlFor="quantity"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Cantidad
          </label>
          <InputText
            id="quantity"
            name="quantity"
            value={formData.quantity}
            type="Number"
            onChange={handleInputChange}
            placeholder="Ingrese la cantidad"
            className={classNames({
              "p-invalid": submitted && !formData.quantity,
            })}
          />
          {submitted && !formData.quantity && (
            <Message
              className="small-message"
              severity="error"
              text="Cantidad es requerida"
            />
          )}
        </div>

        {/* Unit of Measurement */}
        <div className="field mb-3">
          <label
            htmlFor="unit_of_measurement"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Unidad de Medida
          </label>
          <Dropdown
            value={formData.unit_of_measurement}
            onChange={(e) => handleDropdownChange(e, "unit_of_measurement")}
            options={unitsOfMeasurement}
            placeholder="Seleccione la unidad de medida"
            className={classNames({
              "p-invalid": submitted && !formData.unit_of_measurement,
            })}
          />
          {submitted && !formData.unit_of_measurement && (
            <Message
              className="small-message"
              severity="error"
              text="Unidad de medida es requerida"
            />
          )}
        </div>

        {/* Planned Cost */}
        <div className="field mb-3">
          <label
            htmlFor="planned_cost"
            className="text-[#003462] font-black text-sm mb-3"
          >
            Costo Planificado
          </label>
          <InputText
            id="planned_cost"
            name="planned_cost"
            type="Number"
            value={formData.planned_cost}
            onChange={handleInputChange}
            placeholder="Ingrese el costo planificado"
            className={classNames({
              "p-invalid": submitted && !formData.planned_cost,
            })}
          />
          {submitted && !formData.planned_cost && (
            <Message
              className="small-message"
              severity="error"
              text="Costo planificado es requerido"
            />
          )}
        </div>

        <Button
          label={loading ? "Guardando..." : "Registrar Solicitud"}
          icon="pi pi-check"
          onClick={confirmSubmit}
          disabled={loading}
        />
      </form>
    </div>
  );
}
