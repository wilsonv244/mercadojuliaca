"use client";
import { useState } from "react";
import { DataTableLista } from "../tools/dataTable";
import lsOpciones from "../admin/lsMenus.json";
import { DataTableUsuario } from "./usuario/dtUsuarios";
import dtUsuario from "../gobiernoDatos/usuarios.json";
import { DataTablePerfil } from "./perfil/dtPerfil";
import dtDashboard from "../gobiernoDatos/listDashboard.json";
import { DataTableDashboard } from "./dashboard/dtDashboard";
import { Transacciones } from "./transaccion/Transacciones";
import { SectionPeticiones } from "./peticiones/dtPeticiones";

export default function AdminPanelMain() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectItem, setSelectItem] = useState(null);
  const [dataDashboard, setDataDashboard] = useState(dtDashboard.ListDashboard);
  const data = [];
  return (
    <>
      <div className="mx-auto w-11/12 lg:flex lg:gap-10 lg:justify-between">
        <div className=" lg:w-1/6 w-11/12 mb-5">
          <DataTableLista
            selectedProduct={selectedProduct}
            setSelectItem={setSelectItem}
            setSelectedProduct={setSelectedProduct}
            nombreDashboard="Opciones"
            data={lsOpciones.Menus}
          />
        </div>
        <div className=" lg:w-4/5 w-11/12">
          <h2 className="text-center font-bold text-2xl mt-4 m-auto">
            {selectItem != null ? selectItem.cName : null}
          </h2>
          {selectItem != null ? (
            (() => {
              console.log(selectItem.cName);
              switch (selectItem.cName) {
                case "Usuario":
                  return <DataTableUsuario dataUsuarios={dtUsuario.perfiles} />;

                case "Perfiles":
                  return <DataTablePerfil />;

                case "Dashboard":
                  return (
                    <DataTableDashboard
                      dataDashboard={dataDashboard}
                      setDataDashboard={setDataDashboard}
                    />
                  );
                case "Transacciones":
                  return (
                    <DataTableDashboard
                      dataDashboard={dataDashboard}
                      setDataDashboard={setDataDashboard}
                    />
                  );
                case "Reporte de Pagos":
                  return <Transacciones />;

                case "Consulta de peticiones":
                  return <SectionPeticiones />;

                default:
                  return null;
              }
            })()
          ) : (
            <h2></h2>
          )}
        </div>
      </div>
    </>
  );
}
