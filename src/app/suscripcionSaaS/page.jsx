"use client";

import {SuscriptionFormPage} from "./suscriptionFormPage";
import {ResumenPage} from "./resumenPage";
import Header from "../panelPublicitario/header";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useState, useEffect } from "react";
export default function SuscriptionPage() {
    const objProduct = [
      {
          idProducto : 0,
          cNameProducto: "Plan Empresa",
          lVariaNumConsultas: false,
          minConsultas: 1000,
          maxConsultas: 1000,
          nCostOne: 0.50,
          nCostMonth: 500,
          nCostAnual: 12000
      },
      {
          idProducto : 1,
          cNameProducto: "Plan Basico",
          lVariaNumConsultas: true,
          minConsultas: 50,
          maxConsultas: 1000,
          nCostOne: 0.8,
          nCostMonth: 40,
          nCostAnual: 480
      }
    ]
    const objProductBuy = {
        id : 0,
        cloud : '',
        idProduct: 0,
        cProduct: '',
        nNumQuerys: 0,
        nCostOne: 0,
        nCostMonth: 0,
        nCostAnual: 0,
        nModalidadPago: 0,
        nCostPay: 0
    }
    const objPerson = {
        userName : '',
        cEmail : '',
        cNameCompany : '',
        nNumExperiencia : 0,
        nNumEmployes : 0,
        cSedePrincipal : ''
    }
    const objTicketBuy = {
        dFechaPago : null,
        objPerson : objPerson,
        objProducto : []
    }

    const confirmBuyAccept = ()  => {
      setTicketBuy(objTicketBuy);
      setDataPersona(objPerson);
      setConfirmBuy(false);
    }

    const [ticketBuy, setTicketBuy] = useState(objTicketBuy);
    const [dataProductoBuy, setDataProductoBuy] = useState(objProductBuy);
    const [dataPersona, setDataPersona] = useState(objPerson);
    const [confirmBuy, setConfirmBuy] = useState(false);

    const footerContent = (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => setConfirmBuy(false)} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={() => confirmBuyAccept()} autoFocus />
        </div>
    );

  return (
    <div className=" bg-slate-950 h-screen">
        <Header />
        <div className="bg-slate-950">
          <section className="max-w-6xl mx-auto px-4 sm:px-6 relative pt-20">
              <div className="sm:grid grid-cols-2  text-white gap-4 ">
                  <ResumenPage
                    ticketBuy = {ticketBuy}
                    setTicketBuy = {setTicketBuy}
                    setConfirmBuy = {setConfirmBuy}
                  />
                  <SuscriptionFormPage 
                    dataPersona = {dataPersona}
                    setDataPersona = {setDataPersona}
                    dataProductoBuy = {dataProductoBuy}
                    setDataProductoBuy = {setDataProductoBuy}
                    ticketBuy = {ticketBuy}
                    setTicketBuy = {setTicketBuy}
                    objProduct = {objProduct}
                  />
              </div>
          </section>
          <Dialog header="Bienvenido a Bordo!!!" visible={confirmBuy} style={{ width: '50vw' }} onHide={() => setConfirmBuy(false)} footer={footerContent}>
            <p className="m-0">
                Gracias por tu compra! Estamos emocionados de tenerte a bordo. Antes de que comiences a explorar todas las increibles funciones, te enviaremos un correo con los ajustes necesarios para que puedas empezar a usar el panel de administarcion del Dashboard. Espera nuestro correo pronto!
            </p>
          </Dialog>
        </div>
    </div>
  );
}