"use client";
import { useState } from "react";
import { DataTableLista } from "../tools/dataTable";
import lsOpciones from "../costos/opcionesMenu.json";
import PurchaseRequestForm from "./purchaseRequest/solicitudCompra";
import PurchaseOrderForm from "./purchaseOrder/formPurchaseOrder";
import PurchaseShipmentForm from "./purchaseShipment/formPurchaseShipment";
import ShipmentPaymentForm from "./shipmentPayment/formShipmentPayment";
import DiscountPaymentCost from "./discountPayment/formDiscountPayment";
import ReportRequest from "./reportRegister/reportRequest";

export default function AdminCostos() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectItem, setSelectItem] = useState(null);
  const user = localStorage.getItem("user_login");
  const userProfile = JSON.parse(user);

  return (
    <>
      <div className="mx-auto w-11/12 lg:flex lg:gap-10 lg:justify-between">
        <div className=" lg:w-1/6 w-11/12 mb-5">
          <DataTableLista
            selectedProduct={selectedProduct}
            setSelectItem={setSelectItem}
            setSelectedProduct={setSelectedProduct}
            nombreDashboard="Opciones"
            data={
              userProfile.profile == "GERENTE GENERAL"
                ? lsOpciones.Menus.slice(0, 6)
                : lsOpciones.Menus.slice(0, 5)
            }
          />
        </div>
        <div className=" lg:w-4/5 w-11/12">
          <h2 className="text-center font-bold text-2xl mt-4 m-auto">
            {selectItem != null ? selectItem.cName : null}
          </h2>
          {selectItem != null ? (
            (() => {
              switch (selectItem.cName) {
                case "Solicitud Compra":
                  return <PurchaseRequestForm />;
                case "Solicitud Orden Compra":
                  return <PurchaseOrderForm />;
                case "Solicitud de Embarque":
                  return <PurchaseShipmentForm />;
                case "Liquidez de Cuentas a pagar":
                  return <ShipmentPaymentForm />;
                case "Nota de Créditos de costos":
                  return <DiscountPaymentCost />;
                case "Reporte de Solicitudes de Compra":
                  return <ReportRequest />;

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
