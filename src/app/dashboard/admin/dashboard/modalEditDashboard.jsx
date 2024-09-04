import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Button } from "primereact/button";
import { MultiSelect } from 'primereact/multiselect';
import { PanelDashoard } from "../../gobiernoDatos/PanelDashboard";
import CatPerfiles from "../perfil/lsCatPerfil.json";
import { Checkbox } from "primereact/checkbox";
import React, { useEffect } from 'react';
export function ModalEditarDashoard({ dashboard, setDashboard, modalDashboard,setModalDashboard }) {
  const [nomDashboard, setNomDashboard] = useState(null);
  const [descDashboard, setDescDashboard] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [selectedPerfiles, setSelectedPerfiles] = useState(null);
  const [newListPerfiles, setNewListPerfiles] = useState(null);
  const [checked, setChecked] = useState(false);
  const estados = [
          { name: 'Activo', code: 1 },
          { name: 'Inactivo', code: 0 }
        ];
  const [catPerfiles, setCatPerfiles] = useState([]);

  const closedModal = () => {
    setModalDashboard(false);
  };

  const saveDataModal = () => {
    closedModal();
    const newListAccess = selectedPerfiles?.map((item) => ({cPerfil: item.cPerfil}))
    dashboard.cNombreDashboard = nomDashboard;
    dashboard.cDescripcion = descDashboard;
    dashboard.lEstado = selectedEstado;
    dashboard.lstPerfiles = newListAccess;
  }
    
  const changeState = (data)=>{
      setSelectedEstado(data.checked);
  }

  const changeAccessProfiles = (data)=>{
      setSelectedPerfiles(data.value);
  }

  useEffect(() => {
      setCatPerfiles(CatPerfiles.perfiles.map(perfil => ({cPerfil:perfil.cName, idPerfil:perfil.idPerfil})));
      setSelectedEstado(dashboard.lEstado);
      setSelectedPerfiles(catPerfiles.filter(perfil => dashboard.lstPerfiles.some(cPerfil => cPerfil.cPerfil === perfil.cPerfil)));
      setNomDashboard(dashboard.cNombreDashboard);
      setDescDashboard(dashboard.cDescripcion);
  }, [modalDashboard]);
  
  return (
    <>
      <Dialog
        header={"("+dashboard.idDashboard+")Dashboard-"+dashboard.cNombreDashboard}
        visible={modalDashboard}
        style={{ width: "80vw", color: "#FF287" }}
        onHide={() => closedModal()}
      >
        <div className="grid grid-cols-2 gap-8">
          <div className="">
            <div className="grid-flow-col">
                <label className="text-sm text-gray-500 pl-2" htmlFor="nombre-dashboard">Nombre</label>
                <InputText className="w-full" id="nombre-dashboard" aria-describedby="username-help" value={nomDashboard} onChange={(e) => setNomDashboard(e.target.value)}/>
            </div>
            <div className="grid-flow-col">
                <label className="text-sm text-gray-500 pl-2" htmlFor="descripcion-dashboard">Descripcion</label>
                <InputText className="w-full" id="descripcion-dashboard" aria-describedby="username-help" value={descDashboard} onChange={(e) => setDescDashboard(e.target.value)}/>
            </div>  
            <div className="card justify-content-center">
                <label className="text-sm text-gray-500 pl-2">Accesos</label>
                <MultiSelect value={selectedPerfiles} onChange={changeAccessProfiles} options={catPerfiles} optionLabel="cPerfil" 
                    filter placeholder="Seleccionar perfiles" maxSelectedLabels={3} className="w-full md:w-20rem" />
            </div>                                 
            <div className="mt-2">  
                <label className="text-sm text-gray-500 pl-2" htmlFor="estado">Activo</label>
                <Checkbox className="ml-2" onChange={changeState} checked={selectedEstado} id="estado"></Checkbox>
            </div>
            <div className="flex gap-4 justify-end mt-4">
              <Button label="Guardar" severity="help" icon="pi pi-check" onClick= {() => saveDataModal()}/>
              <Button
                label="Cancelar"
                severity="danger"
                onClick={() => closedModal()}
              />
            </div>
          </div>
          <div className="w-full relative">
            <div className=" absolute w-full h-full"></div>
            <PanelDashoard selectItem={dashboard}/>
          </div>
        </div>
      </Dialog>
    </>
  );
}
