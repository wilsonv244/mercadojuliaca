import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tag } from 'primereact/tag';
import { useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { ModalEditarDashoard } from "./modalEditDashboard";
import { ModalAddDashoard } from "./modalAddDashboard";

export function DataTableDashboard({ dataDashboard, setDataDashboard }) {
  const [selectOption, setSelectionOption] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [statuses] = useState(['Activo', 'Inactivo']);
  const [filter, setFilter] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [modalAddDashboard, setModalAddDashboard] = useState(false);
  const onGlobalFilterChange = (e) => {
      const value = e.target.value;
      let _filter = { ...filter };
      _filter["global"].value = value;

      setFilter(_filter);
      setGlobalFilterValue(e.target.value);
  };

  const getSeverity = (value) => {
  switch (value) {
      case true:
          return 'success';
      // case 'Inactivo':
      //     return 'warning';
      case false:
          return 'danger';
      default:
          return null;
  }
  };
  const statusBodyTemplate = (rowData) => {
      return <Tag value={rowData.lEstado?"Activo":"Inactivo"} severity={getSeverity(rowData.lEstado)}></Tag>;
  };
  const renderHeader = () => {
    return (
      <div className="flex justify-between">
        <Button
          onClick={()=>setModalAddDashboard(true)}
          icon="pi pi-plus"
          severity="help"
          aria-label="Favorite"
          className="mb-4"
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Buscar"
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
  const eventStyleTable = (e) => {
    if (selectOption != null) {
      const estilo =
        e.idDashboard == selectOption.value.idDashboard
          ? " p-highlight p-selectable-row"
          : "";
      return estilo;
    }
  };
  const header = renderHeader();

  const [dashboard, setDashboard] = useState(null);
  const [modalDashboard, setModalDashboard] = useState(false);
  const editarDashboard = (dataDashboard) => {
    setDashboard(dataDashboard);
    setModalDashboard(true);
  };
  const cPerfil = (rowData) => {
    let lastElement = false;
    return (
      <p>
        {rowData.lstPerfiles.map((dato) => {
          lastElement = rowData.lstPerfiles.indexOf(dato) === rowData.lstPerfiles.length - 1;
          return (
            <>
              {dato.cPerfil} 
              {lastElement ? '' : ', '}
            </>
          );
        })}
      </p>
    );
  }
  const allowEdit = (rowData) => {
        return (
          <i 
            className="pi pi-pencil hover:text-indigo-600 hover:font-bold" 
            style={{ fontSize: '1rem' }}
            onClick={() => editarDashboard(rowData)}
          ></i>
        );
    };

  return (
    <div>
      <DataTable
        filters={filter}
        paginator
        rows={10}
        value={dataDashboard}
        selectionMode="single"
        rowsPerPageOptions={[5, 10, 25, 50]}
        header={header}
        selection={selectOption}
        onSelectionChange={(e) => seleccionar(e)}
        rowClassName={eventStyleTable}
      >
        <Column field="idDashboard" header="idDashboard"></Column>
        <Column field="cNombreDashboard" header="NombreDashboard"></Column>
        <Column field="cDescripcion" header="Descripcion"></Column>
        <Column header="Accesos" body={cPerfil}></Column>
        <Column field="cEstado" header="Estado" body={statusBodyTemplate}></Column>
        <Column  body={allowEdit}></Column> 
        {/* <Column body={showVigenciaUpdate} header="ESTADO"></Column>
        <Column body={ShowVigencia} header="VIGENCIA"></Column> */}
      </DataTable>
      {dashboard != null ? (
        <>
          <ModalEditarDashoard
            dashboard={dashboard}
            setDashboard={setDashboard}
            modalDashboard={modalDashboard}
            setModalDashboard={setModalDashboard}
          />
        </>
      ) : null}
      {modalAddDashboard == true ? (
        <>
          <ModalAddDashoard
            dataDashboard={dataDashboard}
            setDataDashboard={setDataDashboard}
            modalAddDashboard={modalAddDashboard}
            setModalAddDashboard={setModalAddDashboard}
          />
        </>
      ) : false}
    </div>
  );
}
