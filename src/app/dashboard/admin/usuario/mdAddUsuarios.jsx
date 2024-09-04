import { useForm, Controller } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import React, { useRef } from "react";
import { customerRegister } from "@/infraestructure/useCases/CustommerUseCase";
import { Toast } from "primereact/toast";

export function ModalUsuario({ visible, setVisibleMCliente }) {
  const toast = useRef(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const show = (mensaje, state) => {
    if (toast.current) {
      toast.current.show({
        severity: state,
        summary: "Respuesta",
        detail: mensaje,
      });
    }
  };
  const onSubmit = async (data) => {
    // llamar a la API
    const body = JSON.stringify(data);
    console.log(data);
    const callApi = await customerRegister(body);
    if (callApi.Code === 400) {
    } else {
      show("Registrado correctamente", "success");
      cerrar();
    }
    console.log(callApi);
  };
  const cerrar = () => {
    reset();
    setVisibleMCliente(false);
  };
  return (
    <Dialog
      header="Registrar Usuario"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => cerrar()}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pt-2 mt-5 rounded-xl mb-4">
          <div className="flex gap-5 ">
            <div className="flex-auto">
              <label htmlFor="firstName" className="font-bold block mb-2">
                Nombre
              </label>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                rules={{ required: "Nombre es requerido" }}
                render={({ field }) => (
                  <InputText
                    {...field}
                    className={`w-full ${errors.firstName ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.firstName && (
                <small className="p-error">{errors.firstName.message}</small>
              )}
            </div>
            <div className="flex-auto">
              <label htmlFor="lastName" className="font-bold block mb-2">
                Apellido
              </label>
              <Controller
                required
                name="lastName"
                control={control}
                rules={{ required: "El Apellido es requerido" }}
                defaultValue=""
                render={({ field }) => (
                  <InputText
                    {...field}
                    className={`w-full ${errors.lastName ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.lastName && (
                <small className="p-error">{errors.lastName.message}</small>
              )}
            </div>
          </div>
          <div className="flex gap-5 mt-2">
            <div className="flex-auto">
              <label htmlFor="email" className="font-bold block mb-2">
                Correo Electronico
              </label>
              <Controller
                name="email"
                rules={{ required: "El email Electronico es requerido" }}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputText
                    {...field}
                    className={`w-full ${errors.email ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.email && (
                <small className="p-error">{errors.email.message}</small>
              )}
            </div>
          </div>
          <div className="flex gap-5 mt-3">
            <div className="flex-auto">
              <label htmlFor="startDate" className="font-bold block mb-2">
                Fecha Inicio
              </label>
              <Controller
                name="startDate"
                control={control}
                defaultValue=""
                rules={{ required: "startDate es requerido" }}
                render={({ field }) => (
                  <Calendar
                    {...field}
                    className={`w-full ${errors.startDate ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.startDate && (
                <small className="p-error">{errors.startDate.message}</small>
              )}
            </div>
            <div className="flex-auto">
              <label htmlFor="endDate" className="font-bold block mb-2">
                Fecha Finalización
              </label>
              <Controller
                name="endDate"
                control={control}
                defaultValue=""
                rules={{ required: "La Fecha de Finalización es requerido" }}
                render={({ field }) => (
                  <Calendar
                    {...field}
                    className={`w-full ${errors.endDate ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.endDate && (
                <small className="p-error">{errors.endDate.message}</small>
              )}
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button
              type="submit"
              label="Guardar Cambios"
              icon="pi pi-save"
              className="p-button-sucess"
            />
          </div>
        </div>
      </form>
      <Toast ref={toast}></Toast>
    </Dialog>
  );
}
