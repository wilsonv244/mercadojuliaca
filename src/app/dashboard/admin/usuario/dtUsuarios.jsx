import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
import { ModalUsuario } from "./mdAddUsuarios";
import { CustomerRetrive } from "@/infraestructure/useCases/CustommerUseCase";

export function DataTableUsuario({ dataUsuarios }) {
  const [dataUsuario, setDataUsuario] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseApi = await CustomerRetrive();
        console.log(responseApi.UserManagement.UserList);
        setDataUsuario(responseApi.UserManagement.UserList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const [selectOption, setSelectionOption] = useState(null);

  const [visibleMCliente, setVisibleMCliente] = useState(false);

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [filter, setFilter] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;

    let _filter = { ...filter };

    _filter["global"].value = value;

    setFilter(_filter);
    setGlobalFilterValue(e.target.value);
  };
  const renderHeader = () => {
    return (
      <div className="flex justify-between">
        {/* {selectOption != null ? (
          <>
            <h1></h1>
          </>
        ) : (
          ""
        )} */}
        <div>
          <Button
            type="button"
            icon="pi pi-plus-circle"
            severity="success"
            rounded
            //onClick={exportExcel(detallePago.Catalogos)}
            data-pr-tooltip="XLS"
            className="ml-4"
            onClick={() => setVisibleMCliente(true)}
          />
          <Button
            type="button"
            icon="pi pi-file-excel"
            severity="warning"
            rounded
            className=" ml-32"
            //onClick={exportExcel(detallePago.Catalogos)}
            data-pr-tooltip="XLS"
          />
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar Cuenta"
          />
        </span>
      </div>
    );
  };
  const seleccionar = (e) => {
    // setVigente(e.value.lVigente == !1 ? false : true);
    // setVigenteCsv(e.value.lVigenteCsv == !1 ? false : true);
    // setShowModald(true);
    setSelectionOption(e);
  };
  const statusBodyTemplate = (rowData) => {
    console.log(rowData);
    let Perfiles = "";
    Perfiles = rowData.UserProfiles.map((e) => Perfiles + e.ProfileName);
    console.log(Perfiles.join(","));
    return Perfiles.join(",");
  };
  const eventStyleTable = (e) => {
    if (selectOption != null) {
      const estilo =
        e.UserID == selectOption.value.UserID
          ? " p-highlight p-selectable-row"
          : "";
      return estilo;
    }
  };

  const header = renderHeader();
  return (
    <div>
      <DataTable
        filters={filter}
        paginator
        rows={10}
        value={dataUsuario}
        selectionMode="single"
        rowsPerPageOptions={[5, 10, 25, 50]}
        header={header}
        selection={selectOption}
        onSelectionChange={(e) => seleccionar(e)}
        rowClassName={eventStyleTable}
      >
        <Column
          header="#"
          headerStyle={{ width: "3rem" }}
          body={(data, options) => options.rowIndex + 1}
        ></Column>
        <Column field="UserID" header="IdUsuario"></Column>
        <Column field="UserName" header="Usuario"></Column>
        <Column
          field="UserProfiles"
          body={statusBodyTemplate}
          header="Perfil"
        ></Column>
        <Column field="LastAccessDate" header="Ultimo Acceso"></Column>
        {/* <Column body={showVigenciaUpdate} header="ESTADO"></Column>
        <Column body={ShowVigencia} header="VIGENCIA"></Column> */}
      </DataTable>

      <div className="card flex justify-content-center w-full">
        <ModalUsuario
          visible={visibleMCliente}
          setVisibleMCliente={setVisibleMCliente}
        />
      </div>
    </div>
  );
}
