import React from 'react'; 
import { Button } from "primereact/button";
import { useState, useEffect } from "react";
import { InputNumber } from 'primereact/inputnumber';

export function ProductSection({activeIndex,setActiveIndex,ticketBuy, setTicketBuy,dataProductoBuy,setDataProductoBuy, objProduct}) {
    const numMeses = 12;
    const [lstProducto, setLstProducto] = useState([]);
    const [selectModalidadPay, setSelectModalidadPay] = useState(1);
    const [lChange, setLChange] = useState(0);

    const agregarProducto = (id) =>{
        const objBuy = lstProducto.find(objeto => objeto.id === id);
        const objBuyProducto = {
            id : ticketBuy.objProducto.length + 1,
            cloud : objBuy.cloud,
            idProduct: objBuy.idProducto,
            cProduct: objBuy.cProduct,
            nNumQuerys: objBuy.nNumQuerysChange,
            nCostOne: objBuy.nCostOne,
            nCostMonth: objBuy.nCostMonthChange,
            nCostAnual: objBuy.nCostAnualchange,
            nModalidadPago: objBuy.nModalidadPago,
            nCostPay: objBuy.nModalidadPago === 1 ? objBuy.nCostMonthChange : objBuy.nCostAnualchange
        }

        const newList = ticketBuy.objProducto.concat(objBuyProducto);
        setTicketBuy((prevData)=>({...prevData, objProducto: newList}));
        setActiveIndex(1);
    }
    const seleccionarModPago = (idProducto, selectPago)=>
    {
        const newData = lstProducto.map(objeto => {
            if (objeto.idProducto === idProducto) {
                return { ...objeto, nModalidadPago: selectPago };
            }
            return objeto;
        });
        setLstProducto(newData);
        setLChange(lChange+1);
    }
    const seleccionarNube = (idProducto, cNombreNube)=>
    {
        const newData = lstProducto.map(objeto => {
            if (objeto.idProducto === idProducto) {
                return { ...objeto, cloud: cNombreNube };
            }
            return objeto;
        });
        setLstProducto(newData);
        setLChange(lChange+1);
    }
    const cambiarNumeroConsultas = (idProducto, numConsult) =>
    {
        const newData = lstProducto.map(objeto => {
            if(objeto.lVariaNumConsultas===true)
            {
                if (objeto.idProducto === idProducto) {
                    return { ...objeto, 
                            nNumQuerysChange: numConsult,
                            nCostMonthChange: numConsult*objeto.nCostOne,
                            nCostAnualchange: numConsult*objeto.nCostOne*numMeses
                            };
                }
            }
            return objeto;
        });
        setLstProducto(newData);
        setLChange(lChange+1);
    }
    const formIni = () => 
    {
        const obj = objProduct.map((dataProducto, index)=>{
            return {
                id: index,
                idProducto : dataProducto.idProducto,
                cProduct: dataProducto.cNameProducto,
                lVariaNumConsultas: dataProducto.lVariaNumConsultas,
                cloud: '',
                nNumQuerys: dataProducto.minConsultas,
                nNumQuerysChange: dataProducto.minConsultas,
                nCostOne: dataProducto.nCostOne,
                nCostMonth: dataProducto.nCostMonth,
                nCostAnual: dataProducto.nCostAnual,
                minConsultas: dataProducto.minConsultas,
                maxConsultas: dataProducto.maxConsultas,
                nCostMonthChange: dataProducto.nCostMonth,
                nCostAnualchange: dataProducto.nCostAnual,
                nModalidadPago: 0
            };
        });
        setLstProducto(obj);
        if(lstProducto.length === objProduct.length)
            setLChange(lChange+1);
    }
    const chageProducto = () =>{
        setLstProducto(lstProducto);
    }
    useEffect(() => {
        if(lstProducto.length === objProduct.length) chageProducto();
        if(lstProducto.length === 0)
        {
            formIni();
        }
    }, [lChange]);

    return (
        <div>
            {
                lstProducto.map((producto)=>
                <div key={producto.id}  className='rounded-lg border-white border p-3 mb-4'>
                    <h2 className='text-center text-2xl font-bold mb-6'>{producto.cProduct}</h2>
                    <div className='grid grid-cols-3 gap-4 my-6 px-4'>
                        <span className={producto.cloud === 'AWS'? 'bg-blue-800 text-center rounded-2xl py-4 cursor-pointer':'bg-blue-500 text-center rounded-2xl py-4 cursor-pointer'} onClick={()=>{seleccionarNube(producto.idProducto,'AWS')}}>AWS</span>
                        <span className='bg-blue-500 text-center rounded-2xl py-4' >GCP</span>
                        <span className='bg-blue-500 text-center rounded-2xl py-4' >AZURE</span>
                    </div>
                    <div className='p-4'>
                        <p>Selecciona la cantidad de consultas</p>
                        <div className="flex-auto">
                            <label htmlFor="minmax-buttons" className="font-bold block mb-2">Min-Max</label>
                            <InputNumber inputId="minmax-buttons" value={producto.nNumQuerys} onChange={(e) => cambiarNumeroConsultas(producto.idProducto, e.value)} mode="decimal" showButtons min={producto.minConsultas} max={producto.maxConsultas} />
                        </div>
                        <span className='text-xs'>{producto.nCostOne} $ por consulta</span>
                    </div>
                    <div className='mb-4 grid grid-cols-2 gap-4 p-4'>
                        <div className={producto.nModalidadPago===1?'font-bold rounded-lg p-2 bg-blue-800':'font-bold border rounded-lg p-2 cursor-pointer'} onClick={()=> seleccionarModPago(producto.idProducto,1)}>
                            <h3>Mensual</h3>
                            <span>{producto.nCostMonthChange} $</span>
                        </div>
                        <div className={producto.nModalidadPago===2?'font-bold rounded-lg p-2 bg-blue-800':'font-bold border rounded-lg p-2 cursor-pointer'} onClick={()=> seleccionarModPago(producto.idProducto,2)}>
                            <h3>Anual</h3>
                            <span>{producto.nCostAnualchange} $</span>
                        </div>
                    </div>
                    <Button label="Agregar" onClick={() => agregarProducto(producto.id)}/>
                </div>
                )
            }
        </div>
    );
}