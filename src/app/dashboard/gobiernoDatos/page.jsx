"use client";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRouter } from "next/navigation";
import catalogos from "./listDashboard.json";
import perfiles from "./usuarios.json";
import React, { useState, useEffect, useRef } from "react";
import { PanelDashoard } from "./PanelDashboard";
import { Toast } from "primereact/toast";
import { ConsultDashboard } from "@/infraestructure/useCases/Dashboardlatam/ConsultDashboard";

export default function gobiernoDatos() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectItem, setSelectItem] = useState(null);
  const [cResponseDashboard, setcResponseDashboard] = useState([]);
  const [update, setUpdate] = useState(true);
  const [indice, setIndice] = useState(0);

  const toast = useRef(null);
  const router = useRouter();
  const show = (mensaje, state) => {
    if (toast.current) {
      toast.current.show({
        severity: state,
        summary: "Respuesta",
        detail: mensaje,
      });
    }
  };
  useEffect(() => {
    console.log(catalogos.ListDashboard);
    const idPer = perfiles.perfiles.filter(
      (e) => e.cUser === localStorage.getItem("cUsuario")
    );
    let lsFinal = [];
    let lisPerfiles = [];
    if(idPer.length === 0){
      setcResponseDashboard(catalogos.ListDashboard)
      return;
    }
    lisPerfiles = idPer[0].idDashboards;

    lisPerfiles.forEach(id=>{
      const buscarElemento = catalogos.ListDashboard.find(e=> e.idDashboard === id)
      if(buscarElemento){
        lsFinal.push(buscarElemento)
      }
    })
    console.log(lsFinal);
    setcResponseDashboard(lsFinal)


    const responseApi = async () => {
      try {
        const response = await ConsultDashboard(
          `${process.env.NEXT_URL_CPLATAM}/api/1.0/dashboard/consult/all`
        );
        if (response.header.code === 401) {
          localStorage.clear();
          show("Tiempo de sesión superado, vuelva a iniciar sesión", "warn");
          setTimeout(() => {
            router.push("/");
          }, 3000);
          Cookies.remove("cToken");
          Cookies.remove("cUsuario");
        }
        setIndice(indice + 1);
        if (indice === 0) {
          let Cadena = response.data.map((e) => e.cNombreDashboard).join(",");

          localStorage.setItem("dashboard", Cadena);
          setcResponseDashboard(response.data);
        }
        if (indice >= 1) {
          var arrayMenus = localStorage.getItem("dashboard").split(",");

          response.data.map((e, indice) => {
            e.cNombreDashboard = arrayMenus[indice];
          });

          setcResponseDashboard(response.data);
        }
      } catch (error) {}
    };
    //responseApi();
    console.log(cResponseDashboard);
  }, []);

  const seleccionar = (e) => {
    setSelectedProduct(e);
    setSelectItem(e.value);
  };
  const eventStyleTable = (e) => {
    if (selectedProduct != null) {
      const estilo =
        e.idDashboard == selectedProduct.value.idDashboard
          ? " p-highlight p-selectable-row"
          : "";

      return estilo;
    }
  };
  return (
    <>
      <div className="mx-auto w-11/12 lg:flex lg:gap-10 lg:justify-between">
        <div className=" lg:w-1/6 w-11/12 mb-5">
          <div>
            <DataTable
              value={cResponseDashboard}
              rows={10}
              onSelectionChange={(e) => seleccionar(e)}
              dataKey="idDashboard"
              selectionMode="single"
              selection={selectedProduct}
              rowClassName={eventStyleTable}
              //rowClassName={eventStyleTable}
              dragSelection
            >
              <Column
                style={eventStyleTable}
                field="cNombreDashboard"
                header="Menu"
              ></Column>
            </DataTable>
          </div>
        </div>
        <Toast ref={toast}></Toast>
        <div className=" lg:w-4/5 w-11/12">
          {selectItem != null ? (
            <PanelDashoard selectItem={selectItem} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
