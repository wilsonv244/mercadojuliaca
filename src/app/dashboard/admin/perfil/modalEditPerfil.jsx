import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { ModalTablaUsuario } from "./modalAddUser";
import { Button } from "primereact/button";
import Helper from "../../../../infraestructure/components/Helper";

export function ModalEditarPerfil({
  lRegister,
  perfil,
  modalPerfil,
  setModalPerfil,
  setLsUsuario,
  setEjecutado,
  selectedCustomers,
  setSelectedCustomers,
  value,
  setValue
}) {
  
  const [activoPerfil, setActivoPerfil] = useState(false);
  const setShowModald = () => {
    setModalPerfil(false);
    setValue();
  };
  const helper = new Helper();

  const guardarRegistro = () => {
    const newJson = selectedCustomers.map((e) => ({
      ...e,
      cPerfil: value,
      lVigente: activoPerfil,
      dUltimoAcceso: helper.obtenerFechaActual(),
    }));
    console.log(newJson);
    setLsUsuario(newJson);
    setModalPerfil(false);
    setEjecutado(false);
  };
  console.log(activoPerfil);
  console.log(value);
  const cPerfil =
    lRegister === true ? "Registrar Perfil" : "Editar " + perfil.cPerfil;
  return (
    <>
      <Dialog
        header={cPerfil}
        className="bg-red-100"
        visible={modalPerfil}
        style={{ width: "80vw", color: "#FF287" }}
        onHide={() => setShowModald()}
      >
        {/* <div className="text-base mb-5 mt-0">
          <p className="m-4 text-center ">{cPerfil}</p>
        </div> */}
        <div className="flex items-center gap-2 justify-between">
          <div className="flex content-center items-center gap-4">
            <label htmlFor="" className="text-[#003462] text-base">
              {lRegister ? "Vigencia" : "Actualizar Vigencia"}
            </label>
            <InputSwitch
              checked={activoPerfil}
              onChange={(e) => setActivoPerfil(e.value)}
            />
          </div>
          <div className="flex content-center items-center gap-2 w-5/12">
            <label htmlFor="" className="text-[#003462] text-base w-5/12">
              {lRegister ? "Nombre Perfil" : "Actualizar Perfil"}
            </label>
            <InputText
              value={value}
              className="w-full"
              onChange={(e) => setValue(e.target.value)}
              id="cPerfil"
            />
          </div>
        </div>
        <div>
          <h2 className=" text-start font-semibold text-xl mt-6 mb-6">
            {lRegister
              ? "Agregar Usuarios al Perfil"
              : "Actualizar Usuarios al Perfil"}
          </h2>
          <ModalTablaUsuario
            setSelectedCustomers={setSelectedCustomers}
            selectedCustomers={selectedCustomers}
            setLsUsuario={setLsUsuario}
          />
        </div>
        <div className="flex gap-4 justify-end mt-4">
          <Button
            label="Guardar"
            severity="help"
            onClick={() => guardarRegistro()}
          />
          <Button
            label="Cancelar"
            severity="danger"
            onClick={() => setShowModald()}
          />
        </div>
      </Dialog>
    </>
  );
}
