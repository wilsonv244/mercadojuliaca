import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useEffect, useState } from "react";
import { Tag } from "primereact/tag";
import perfilesLista from "../perfil/lsPerfiles.json";
import usuariosJson from "../../gobiernoDatos/usuarios.json";
import { footerTemplate, getEstadoPerfi } from "../../tools/dataTable";
import { ModalEditarPerfil } from "./modalEditPerfil";
import { Button } from "primereact/button";
import { ProfileRetrieve } from "@/infraestructure/useCases/ProfileUseCase/RegisterProfileUseCase";
export function DataTablePerfil() {
  const [expandedRows, setExpandedRows] = useState([]);
  const [listaPerfiles, setListaPerfiles] = useState([]);
  const [dataPerfil, setDataPerfil] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [modalPerfil, setModalPerfil] = useState(false);
  const [lRegister, setLregister] = useState(true);
  const [lsUsuarios, setLsUsuario] = useState([]);
  const [ejecutado, setEjecutado] = useState(true);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [value, setValue] = useState();
  let dataPerfiles = usuariosJson.perfiles.concat(lsUsuarios);
  console.log(lsUsuarios);
  console.log(dataPerfiles);

  console.log(expandedRows);
  useEffect(() => {
    const lsProfiles = async () => {
      const responseApi = await ProfileRetrieve();
      console.log(responseApi);
      let dataPerfiles = responseApi.UserProfiles.flatMap((perfil) => {
        return perfil.Users.map((user) => {
          return {
            ProfileID: perfil.ProfileID,
            ProfileName: perfil.ProfileName,
            IsActive: perfil.IsActive,
            UserID: user.UserID,
            UserName: user.UserName,
            LastAccessDate: user.LastAccessDate,
            RegistrationDate: user.RegistrationDate,
          };
        });
      });
      console.log(dataPerfiles);
      setListaPerfiles(dataPerfiles);
    };
    lsProfiles();
    if (ejecutado) {
      setDataPerfil(usuariosJson.perfiles);
      setSelectedCustomers([]);
    } else {
      console.log("ingresando aquí");
      setDataPerfil((prevDataPerfiles) => [...prevDataPerfiles, ...lsUsuarios]);
      setSelectedCustomers([]);
    }
    //setDataPerfil((prevDataPerfiles) => [...prevDataPerfiles, ...lsUsuarios]);
  }, [lsUsuarios]);

  console.log(listaPerfiles);

  const editarPerfil = (perfilData) => {
    console.log(perfilData);
    const filtroUsuarios = usuariosJson.perfiles.filter(
      (e) => e.ProfileName === perfilData.ProfileName
    );
    setSelectedCustomers(filtroUsuarios);
    console.log(filtroUsuarios);
    setValue(perfilData.ProfileName);
    setPerfil(perfilData);
    setModalPerfil(true);
    setLregister(false);
  };

  const headerTemplate = (listaPerfiles) => {
    return (
      <div className="flex justify-between">
        <span className="vertical-align-middle ml-2 font-bold line-height-3">
          {listaPerfiles.ProfileName}
        </span>
        <i
          onClick={() => editarPerfil(listaPerfiles)}
          className="pi pi-pencil hover:text-red-600 hover:font-bold vertical-align-middle"
        ></i>
      </div>
    );
  };
  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.IsActive ? "Activo" : "Inactivo"}
        severity={getEstadoPerfi(rowData.IsActive)}
      />
    );
  };
  const nUsuario = footerTemplate(listaPerfiles);
  const ActiveModalRegistrar = () => {
    setLregister(true);
    setModalPerfil(true);
  };

  return (
    <div className="card">
      <div className="mb-4">
        <Button
          onClick={ActiveModalRegistrar}
          icon="pi pi-plus"
          severity="help"
          aria-label="Favorite"
          className="mb-4"
        />
      </div>
      <DataTable
        value={listaPerfiles}
        rowGroupMode="subheader"
        groupRowsBy="ProfileName"
        sortMode="single"
        sortField="representative.name"
        sortOrder={1}
        expandableRowGroups
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowGroupHeaderTemplate={headerTemplate}
        rowGroupFooterTemplate={(e) => footerTemplate(e.data)}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          field="UserName"
          header="Usuarios"
          style={{ width: "30%" }}
        ></Column>
        <Column
          field="IsActive"
          header="Status"
          body={statusBodyTemplate}
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="RegistrationDate"
          header="Fecha Registro"
          style={{ width: "30%" }}
        ></Column>
      </DataTable>
      <ModalEditarPerfil
        selectedCustomers={selectedCustomers}
        setSelectedCustomers={setSelectedCustomers}
        setEjecutado={setEjecutado}
        setLsUsuario={setLsUsuario}
        lRegister={lRegister}
        perfil={perfil}
        modalPerfil={modalPerfil}
        setModalPerfil={setModalPerfil}
        setValue={setValue}
        value={value}
      />
    </div>
  );
}
