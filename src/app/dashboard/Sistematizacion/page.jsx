"use client";
import { useState } from "react";
import { DataTableLista } from "../tools/dataTable";
import lsMenusSistematizacion from "../Sistematizacion/lsMenusSistematizacion.json";
import dtUsuario from "../gobiernoDatos/usuarios.json";
import dtDashboard from "../gobiernoDatos/listDashboard.json";
import VendedorForm from "./saler/VendedorForm";
import ClienteForm from "./client/ClienteForm";
import ProveedorForm from "./provider/ProviderForm";

export default function PanelSistematizcion() {
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
            data={lsMenusSistematizacion.Menus}
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
                case "Clientes":
                  return <ClienteForm />;

                case "Vendedores":
                  return <VendedorForm />;

                case "Proveedor":
                  return <ProveedorForm />;

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
