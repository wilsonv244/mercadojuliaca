import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Button } from "primereact/button";
import { MultiSelect } from 'primereact/multiselect';
import { PanelDashoard } from "../../gobiernoDatos/PanelDashboard";
import { Checkbox } from "primereact/checkbox";
import isValid from 'url-validator';
import CatPerfiles from "../perfil/lsCatPerfil.json";
import React, { useEffect, Suspense } from 'react';
import { list } from "postcss";
export function ModalAddDashoard({ dataDashboard,setDataDashboard, modalAddDashboard, setModalAddDashboard }) {
  const [catPerfiles, setCatPerfiles] = useState([]);
  const [renderDashboard, setRenderDashboard] = useState(false);
  const [selectedPerfiles, setSelectedPerfiles] = useState([]);
  const [objNewDashboard,setObjNewDashboard] = useState({ 
            idDashboard: 0, 
            cUrl: "", 
            cNombreDashboard: "",
            cDescripcion: "",
            lEstado: false,
            idDashboard: "",
            lstPerfiles: []
          });

  const closedModal = () => {
    setModalAddDashboard(false);
  };

  const saveDataModal = () => {
    closedModal();
    const newListDashboard = dataDashboard.concat([objNewDashboard]);
    setDataDashboard(newListDashboard);
    console.log(dataDashboard)
    console.log(newListDashboard)
  }
  
  const changeUrl = (data)=>{
    setObjNewDashboard((prevData)=>({...prevData,cUrl: data.target.value,}));
    const isValidUrl = isValid(data.target.value);
    if(isValidUrl)
    {
      console.log("valido");
      setRenderDashboard(true);
    }
    else
    {
      console.log("no valido");
      setRenderDashboard(false);
    }
  } 

  const changeState = (data)=>{
    setObjNewDashboard((prevData)=>({
      ...prevData,
      lEstado: data.checked,
    }));
  }

  useEffect(() => {
    const objLastDashboard = dataDashboard[dataDashboard.length - 1];
    setCatPerfiles(CatPerfiles.perfiles.map(perfil => ({cPerfil:perfil.cName, idPerfil:perfil.idPerfil})));
    setObjNewDashboard((prevData)=>({...prevData,idDashboard: (objLastDashboard.idDashboard + 1)}));
  }, []);

  useEffect(()=>{
    if(selectedPerfiles.length > 0)
    {
      const newListAccess = selectedPerfiles?.map((item) => ({cPerfil: item.cPerfil}));
      setObjNewDashboard((prevData)=>({...prevData,lstPerfiles: newListAccess}))
    }
  },[selectedPerfiles]);
  return (
    <>
      <Dialog
        header={"Agregar nuevo dashboard"}
        visible={modalAddDashboard}
        style={{ width: "80vw", color: "#FF287" }}
        onHide={() => closedModal()}
      >
        <div className="grid grid-cols-2 gap-8">
          <div className="">
            <div className="grid-flow-col">
                <label className="text-sm text-gray-500 pl-2" htmlFor="url-dashboard">Enlace</label>
                <InputText className="w-full" id="url-dashboard" aria-describedby="username-help" value={objNewDashboard.cUrl} onChange={(e)=>changeUrl(e)}/>
            </div>
            <div className="grid-flow-col">
                <label className="text-sm text-gray-500 pl-2" htmlFor="nombre-dashboard">Nombre</label>
                <InputText className="w-full" id="nombre-dashboard" aria-describedby="username-help" value={objNewDashboard.cNombreDashboard} onChange={(e)=>setObjNewDashboard((prevData)=>({...prevData,cNombreDashboard: e.target.value,}))}/>
            </div>
            <div className="grid-flow-col">
                <label className="text-sm text-gray-500 pl-2" htmlFor="descripcion-dashboard">Descripcion</label>
                <InputText className="w-full" id="descripcion-dashboard" aria-describedby="username-help" value={objNewDashboard.cDescripcion} onChange={(e)=>setObjNewDashboard((prevData)=>({...prevData,cDescripcion: e.target.value,}))}/>
            </div>  
            <div className="card justify-content-center">
                <label className="text-sm text-gray-500 pl-2">Accesos</label>
                <MultiSelect value={selectedPerfiles} onChange={(e)=> setSelectedPerfiles(e.target.value)} options={catPerfiles} optionLabel="cPerfil" 
                    filter placeholder="Seleccionar perfiles" maxSelectedLabels={3} className="w-full md:w-20rem" />
            </div>                                 
            <div className="mt-2">  
                <label className="text-sm text-gray-500 pl-2" htmlFor="estado"> Activo</label>
                <Checkbox className="ml-2" onChange={changeState} checked={objNewDashboard.lEstado} inputId="estado" name="estados"></Checkbox>
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
            {renderDashboard == true ? (
              <>
                  <PanelDashoard selectItem={objNewDashboard}/>
              </>
            ) : (<>
              <div className="text-center grid content-center h-full w-full text-xl text-stone-200">
                DASHBOARD VACIO
              </div>
            </>)}
          </div>
        </div>
      </Dialog>
    </>
  );
}
