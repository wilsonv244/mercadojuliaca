"use client";
import { useState } from "react";
import { DataTableLista } from "../tools/dataTable";
import lsOpciones from "../movimientoBancario/lsMenus.json";

import FormRegistrarMovBancarioas from "./formRegister";
import BankTransactionForm from "./formRegister";
import ReportDataBases from "../dataBases/DataBasesReport";

export default function MovimientoBancario() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectItem, setSelectItem] = useState(null);

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
              switch (selectItem.cName) {
                case "Registrar Movimiento Bancario":
                  return <BankTransactionForm />;
                case "Exportar Movimiento Bancario":
                  return <ReportDataBases action={"MOVBANCARIO"} />;
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
