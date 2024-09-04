import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { classNames } from "primereact/utils";
import { Dialog } from "primereact/dialog";
import pagosLista from "../transaccion/Gastos.json";
import { VisorModalPdf } from "./ModalVisorPdf";

export function DataTableTransacciones() {
  const [selectOption, setSelectionOption] = useState(null);
  const [datoPdf, setDatoPdf] = useState({});

  const [visibleModalPdf, setVisibleModalPdf] = useState(false);
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
    // setVigenteCsv(e.value.lVigenteCsv == !1 ? false : true);
    setDatoPdf(e.value);
    setVisibleModalPdf(true);
    setSelectionOption(e);
  };
  const eventStyleTable = (e) => {
    if (selectOption != null) {
      const estilo =
        e.idTransaccion == selectOption.value.idTransaccion
          ? " p-highlight p-selectable-row"
          : "";
      return estilo;
    }
  };
  const EstilosMonto = (rowData) => {
    const stockClassName = classNames(
      "border-circle w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm bg-red-100 p-2 rounded-xl text-red-900"
    );

    return <div className={stockClassName}>{rowData.nMontoPago}</div>;
  };
  const header = renderHeader();
  return (
    <div>
      <DataTable
        filters={filter}
        paginator
        rows={10}
        value={pagosLista.Gastos}
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
        <Column field="lEstado" header="Estado"></Column>
        <Column field="cCliente" header="Cliente"></Column>
        <Column field="dFechaPago" header="Fecha de Pago"></Column>
        <Column field="nMontoPago" header="Monto" body={EstilosMonto}></Column>
        {/* <Column body={showVigenciaUpdate} header="ESTADO"></Column>
        <Column body={ShowVigencia} header="VIGENCIA"></Column> */}
      </DataTable>

      <div className="card flex justify-content-center w-full">
        <VisorModalPdf
          visibleModalPdf={visibleModalPdf}
          setVisibleModalPdf={setVisibleModalPdf}
          datoPdf={datoPdf}
        />
      </div>
    </div>
  );
}
