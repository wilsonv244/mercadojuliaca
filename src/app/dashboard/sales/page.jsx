"use client";
import { useState } from "react";
import { DataTableLista } from "../tools/dataTable";
import lsOpciones from "../sales/lsMenus.json";
import IngresoVentasForm from "./salesRegister/SalesForm";
import SalePaymentForm from "./salePayment/SalePaymentForm";
import DescountSaleForm from "./formDescountSale";

export default function AdminPanelMain() {
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
                case "Ingresos":
                  return <IngresoVentasForm />;
                case "Registrar Venta":
                  return <SalePaymentForm />;
                case "Nota de credito de ingresos":
                  return <DescountSaleForm />;

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
