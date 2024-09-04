import React, { useEffect , useState} from 'react'; 
import { Button } from "primereact/button";
import { addDays, format } from 'date-fns';

export function ResumenPage({ticketBuy, setTicketBuy, setConfirmBuy}) {
    const nNumProductos = ticketBuy.objProducto.length;
    const [totalPay, setTotalPay] = useState(0);

    useEffect(()=>{
        let newTotalPay = 0;
        ticketBuy.objProducto.forEach(data => {
            newTotalPay += data.nCostPay;
        });
        setTotalPay(newTotalPay);
    },[ticketBuy.objProducto])

    const [fecha, setFecha] = useState({ dia: 0, mes: 'june' , anio:0});
    const calcularFecha = () => {
        const fechaActual = new Date();
        const fechaMas30Dias = addDays(fechaActual, 30);
        const diaNumero = fechaMas30Dias.getDate();
        const mesTexto = format(fechaMas30Dias, 'MMMM');
        const anio = fechaMas30Dias.getFullYear();
        setFecha({ fechaAct: (diaNumero+"/"+fechaMas30Dias.getMonth()+"/"+anio), dia: diaNumero, mesTexto: mesTexto, mes: fechaMas30Dias.getMonth(), anio:anio});
    };

    useEffect(() => {
        calcularFecha();
        console.log('date');
    }, []);

    const confirmarPedido = () => {
        setTicketBuy((prevData) => {
            const updatedData = { ...prevData, dFechaPago: fecha.fechaAct };
            setConfirmBuy(true); 
            console.log(updatedData); 
            return updatedData; 
        });
    }

    const EnterpriseHtml = () => 
    {
        return (
            <div>
                <div className='mt-2 mb-4'>
                    <h5 className='font-bold'>Datos de Empresa</h5>
                    <div className='pl-4 text-xs'>
                        <div className='flex justify-between'>
                            <span>{ticketBuy.objPerson.cNameCompany}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>{ticketBuy.objPerson.cEmail}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const productosHtml = () => 
    {
        return (
            <div>
                {
                ticketBuy.objProducto.map((item) => 
                    <div key={item.id} className='mt-2'>
                        <h5 className='font-bold'>{item.cProduct}</h5>
                        <div className='pl-4'>
                            <div className='flex justify-between'>
                                <p>Total Pagar</p>
                                <span>{item.nCostPay} $</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
    return (
        <section className='sm:order-last'>
            <div className='rounded-lg border-white border p-3'>
                <h2 className='text-center text-2xl font-bold mb-2'>
                    Resumen Del Pedido
                </h2>
                <div>
                    <div>
                        {EnterpriseHtml()}
                        {/* <p>{ticketBuy.objProduct.userName}</p> */}
                    </div>
                </div>
                <span className='text-sm'>(Productos {nNumProductos})</span>
                <hr />
                <div className='my-2'>
                    {productosHtml()}
                    <p className='text-sm'>Proxima fecha de cobro {fecha.mesTexto}, {fecha.dia}, {fecha.anio}</p>
                </div> 
                <hr />
                <div className='my-4'>
                    <div className='flex justify-between font-bold'>
                        <h3>Total de hoy</h3>
                        <span>{totalPay} $</span>
                    </div>
                </div>
                <Button label="Realizar pedido" severity="help" className='w-full' onClick={() => confirmarPedido()}/>
            </div>
        </section>
    );
}