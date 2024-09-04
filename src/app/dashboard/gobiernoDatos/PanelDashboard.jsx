import { useEffect, useRef, useState } from "react";
import { Dashboard1Iframe } from "../iFrame/Dashboard1Iframe";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import { ConsultDashboard } from "@/infraestructure/useCases/Dashboardlatam/ConsultDashboard";
import { useRouter } from "next/navigation";

export function PanelDashoard({ selectItem }) {
  const router = useRouter();
  const [estado, setEstado] = useState(false);
  const [display, setDispaly] = useState("none");
  const [height, setHeight] = useState(80);
  const toast = useRef(null);
  const [url, setUrl] = useState([]);

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
    const responseApi = async () => {
      try {
        const response = await ConsultDashboard(
          `${process.env.NEXT_URL_CPLATAM}/api/dashboard/consult?idDashbaoard=${selectItem.idDashboard}`
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
        setUrl(response.data[0]);
      } catch (error) {}
    };
    console.log("Seleccionar Item");
    console.log(selectItem);
    setTimeout(() => {
      setHeight(height + 1);
    }, 2000);
    //responseApi();
  }, [selectItem]);

  return (
    <>
      <div>
        <Dashboard1Iframe
          height={height}
          src={selectItem.cUrl}
          title={selectItem.cNombreDashboard}
          frameBorder="0"
          display="block"
          allowFullScreen
        />
        <Toast ref={toast}></Toast>
      </div>
    </>
  );
}
