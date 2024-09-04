import React, { useState, useEffect } from 'react'
import { Chart } from 'primereact/chart'
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useContext } from 'react'
import { VarGlobalContext } from '../../../Context'

export function SectionPeticiones() {
    // const context = useContext(VarGlobalContext);
    const responseApisConsumidos = {
        cNomPlan:"Plan basico",
        nCostoHoy:500,
        nCostoAyer: 200,
        nNumTransacciones: 4800,
        arrApisConsumidos: [
            {
                idApi: 0,
                cNameApi: "Consulta dashboard",
                nCosto: 10,
                nCostoTotal: 100,
                nNumConsultas: 1100,
                nNumMaxContratado:1000,
                nNumConsultasExedido:100,
                nNumMax:2000          
            },
            {
                idApi: 0,
                cNameApi: "Consulta nombre uno 1",
                nCosto: 10,
                nCostoTotal: 2300,
                nNumConsultas: 500,
                nNumMaxContratado:1000,
                nNumConsultasExedido:0,
                nNumMax:1000          
            },
            {
                idApi: 0,
                cNameApi: "Consulta nombre dos 2",
                nCosto: 10,
                nCostoTotal: 500,
                nNumConsultas: 900,
                nNumMaxContratado:1000,
                nNumConsultasExedido:0,
                nNumMax:1000          
            },
            {
                idApi: 0,
                cNameApi: "Consulta nombre tres 3",
                nCosto: 10,
                nCostoTotal: 2300,
                nNumConsultas: 2300,
                nNumMaxContratado:1000,
                nNumConsultasExedido:1300,
                nNumMax:3000          
            },
            {
                idApi: 0,
                cNameApi: "Consulta nombre tres 4",
                nCosto: 10,
                nCostoTotal: 2300,
                nNumConsultas: 2300,
                nNumMaxContratado:1000,
                nNumConsultasExedido:1300,
                nNumMax:3000          
            },
            {
                idApi: 0,
                cNameApi: "Consulta nombre tres 5",
                nCosto: 10,
                nCostoTotal: 230,
                nNumConsultas: 2300,
                nNumMaxContratado:1000,
                nNumConsultasExedido:1300,
                nNumMax:3000          
            },
            {
                idApi: 0,
                cNameApi: "Consulta nombre tres 6",
                nCosto: 10,
                nCostoTotal: 2300,
                nNumConsultas: 2300,
                nNumMaxContratado:1000,
                nNumConsultasExedido:1300,
                nNumMax:3000          
            },
            {
                idApi: 0,
                cNameApi: "Consulta nombre tres 7",
                nCosto: 10,
                nCostoTotal: 2300,
                nNumConsultas: 2300,
                nNumMaxContratado:1000,
                nNumConsultasExedido:1300,
                nNumMax:3000          
            },
            {
                idApi: 0,
                cNameApi: "Consulta nombre tres 8",
                nCosto: 10,
                nCostoTotal: 2300,
                nNumConsultas: 2300,
                nNumMaxContratado:1000,
                nNumConsultasExedido:1300,
                nNumMax:3000          
            },
            {
                idApi: 0,
                cNameApi: "Consulta nombre tres 9",
                nCosto: 10,
                nCostoTotal: 2300,
                nNumConsultas: 2300,
                nNumMaxContratado:1000,
                nNumConsultasExedido:1300,
                nNumMax:3000          
            },
            {
                idApi: 0,
                cNameApi: "Consulta nombre tres 10",
                nCosto: 10,
                nCostoTotal: 2300,
                nNumConsultas: 2300,
                nNumMaxContratado:1000,
                nNumConsultasExedido:1300,
                nNumMax:3000          
            },
            {
                idApi: 0,
                cNameApi: "Consulta nombre tres 10",
                nCosto: 10,
                nCostoTotal: 2700,
                nNumConsultas: 2300,
                nNumMaxContratado:1000,
                nNumConsultasExedido:1300,
                nNumMax:3000          
            },
            {
                idApi: 0,
                cNameApi: "Consulta nombre tres 10",
                nCosto: 10,
                nCostoTotal: 4000,
                nNumConsultas: 2300,
                nNumMaxContratado:1000,
                nNumConsultasExedido:1300,
                nNumMax:3000          
            },
            {
                idApi: 0,
                cNameApi: "Consulta nombre tres 10",
                nCosto: 10,
                nCostoTotal: 1000,
                nNumConsultas: 2300,
                nNumMaxContratado:1000,
                nNumConsultasExedido:1300,
                nNumMax:3000          
            }
        ]
    }
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});



    useEffect(() => {

        const cNomBarra = responseApisConsumidos.arrApisConsumidos.map(item => item.cNameApi + " - [" + item.nNumConsultas+ "]")
        const cNumQuerys = responseApisConsumidos.arrApisConsumidos.map(item => item.nNumConsultas);
        const cNumQuerysExtra = responseApisConsumidos.arrApisConsumidos.map(item => item.nNumConsultas < item.nNumMaxContratado? 0 : (item.nNumConsultasExedido))

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const data = {
            labels: cNomBarra,
            datasets: [
                {
                    label: 'Contratado',
                    backgroundColor: '#4F2D7F',
                    borderColor: '#4F2D7F',
                    data: cNumQuerys
                }
            ]
        };
        const options = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        setChartData(data)
        setChartOptions(options);
    }, []);

    const [chartData1, setChartData1] = useState({});
    const [chartOptions1, setChartOptions1] = useState({});

    useEffect(() => {

        const cNomBarra = responseApisConsumidos.arrApisConsumidos.map(item => item.cNameApi + " - [" + item.nNumConsultas+ " - $" + item.nCostoTotal + "]")

        const cCostTotal = responseApisConsumidos.arrApisConsumidos.map(item => item.nCostoTotal)
        
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const data = {
            labels: cNomBarra,
            datasets: [
                {
                    label: "Costo total:",
                    borderColor: "#4F2D7F",
                    pointBackgroundColor: "#4F2D7F",
                    pointBorderColor: "#4F2D7F",
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: "#4F2D7F",
                    data: cCostTotal
                }
            ]
        };
        const options = {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    grid: {
                        color: textColorSecondary
                    }
                }
            }
        };

        setChartData1(data);
        setChartOptions1(options);
    }, []);

    return (
        <div className="w-11/12 m-auto p-4 text-sm bg-[#F8F9FA]">
            <div className='font-bold'>
                <h3>{responseApisConsumidos.cNomPlan.toUpperCase()}</h3>
            </div>
            <div className='pl-2 mt-2'>
                <div className='bg-[#F8F9FA] w-3/4'>
                    <div className='pl-6 grid grid-cols-2'>
                        <div>
                            <div>
                                <p>Costo del mes hasta la fecha</p>
                                <span className='font-bold pl-4'>$ {responseApisConsumidos.nCostoHoy}</span>
                            </div>
                            <div>
                                <p>Numero de transacciones</p>
                                <span className='font-bold pl-4'>{responseApisConsumidos.nNumTransacciones}</span>
                            </div>
                        </div>
                        <div>
                            <p>Pago el mes anterior</p>
                            <span className='font-bold pl-4'>$ {responseApisConsumidos.nCostoAyer}</span>
                        </div>
                    </div>
                </div>
                <div className='pl-4 mt-8 h-full'>
                    <div className='card'>
                        <TabView panelContainerClassName='h-full'>
                            <TabPanel header="Transacciones" >
                                <Chart type="bar" data={chartData} options={chartOptions} />
                            </TabPanel>
                            <TabPanel header="Costo transaccion" className=''>
                                {/* <div className=''>
                                    <DataTable value={responseApisConsumidos.arrApisConsumidos} scrollable scrollHeight="400px" virtualScrollerOptions={{ itemSize: 46 }} tableStyle={{ minWidth: '50rem', fontSize: '0.9rem'}}>
                                        <Column field="idApi" header="Id" style={{ width: '5%' }}></Column>
                                        <Column field="cNameApi" header="cNameApi" style={{ width: '20%' }}></Column>
                                        <Column field="nNumConsultas" header="nNumConsultas" style={{ width: '20%' }}></Column>
                                        <Column field="nCostoTotal" header="Costo" style={{ width: '20%' }}></Column>
                                    </DataTable>
                                </div> */}
                                <div className="card flex justify-content-center">
                                <Chart type="radar" data={chartData1} options={chartOptions1} className="pl-6 w-[70%] m-auto my-[-11rem]"/>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </div>
    );
}
