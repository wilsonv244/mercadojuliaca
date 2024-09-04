import React from 'react'; 
import { Button } from "primereact/button";
import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from "primereact/inputmask";

export function RegisterSection({activeIndex,setActiveIndex,dataPersona,setDataPersona, ticketBuy, setTicketBuy})
{
    const [dataAdmin, setDataAdmin] = useState(ticketBuy.objPerson);

    const registrarAdmin = () => {
        setTicketBuy((prevData)=>({...prevData, objPerson: dataAdmin}))
    }

    useEffect(()=>{
        setDataAdmin(ticketBuy.objPerson);
    },[ticketBuy]);

    return(
        <div>
            <div className='mb-4'>
                <h3 className='font-bold text-xl'>Registrese</h3>
                <p className='text-xs'>Sera el propietario de la cuenta y recibira accesos como administrador</p>
            </div>
            <div className="flex flex-col gap-2 my-4">
                <label htmlFor="username" className='text-sm'>User name</label>
                <InputText id="username" value={dataAdmin.userName} onChange={(e) => setDataAdmin((prevData)=>({...prevData, userName: e.target.value.toUpperCase()}))} aria-describedby="username-help" />
            </div>
            <div className="flex flex-col gap-2 my-4">
                <label htmlFor="emailEnterprise" 
                className='text-sm'>Email de la empresa</label>
                <InputText  id="emailEnterprise" value={dataAdmin.cEmail} onChange={(e) => setDataAdmin((prevData)=>({...prevData, cEmail: e.target.value.toUpperCase()}))}/>
            </div>
            <div className="flex flex-col gap-2 my-4">
                <label htmlFor="companyName" className='text-sm'>Company name</label>
                <InputText id="companyName" value={dataAdmin.cNameCompany} onChange={(e) => setDataAdmin((prevData)=>({...prevData, cNameCompany: e.target.value.toUpperCase()}))} aria-describedby="companyName-help" />
            </div>
            <div className="flex flex-col gap-2 my-4">
                <label htmlFor="Experience" className='text-sm'>Experiencia</label>
                <InputNumber value={dataAdmin.nNumExperiencia} onValueChange={(e) => setDataAdmin((prevData)=>({...prevData, nNumExperiencia: e.target.value}))} prefix="Experience " suffix=" years" />
            </div>
            <div className="flex flex-col gap-2 my-4">
                <label htmlFor="sizeEnterprise" className='text-sm'>Tamaño de la empresa</label>
                <InputNumber value={dataAdmin.nNumEmployes} onValueChange={(e) => setDataAdmin((prevData)=>({...prevData, nNumEmployes: e.target.value}))} suffix=" employes" />
            </div>
            <div className="flex flex-col gap-2 my-4">
                <label htmlFor="sedeEnterprise" className='text-sm'>Sede de la empresa</label>
                <InputText id="sedeEnterprise" value={dataAdmin.cSedePrincipal} onChange={(e) => setDataAdmin((prevData)=>({...prevData, cSedePrincipal: e.target.value.toUpperCase()}))} aria-describedby="sedeEnterprise-help" />
            </div>
            
            <Button label="Guardar" onClick={() => registrarAdmin()}/>
        </div>
    );
}