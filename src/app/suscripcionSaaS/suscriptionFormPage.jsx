import React from 'react'; 
import { Steps } from 'primereact/steps';
import { useState, useEffect } from "react";
import { ProductSection } from './productSection';
import { RegisterSection } from './registerSection';

export function SuscriptionFormPage({dataPersona,setDataPersona,dataProductoBuy,setDataProductoBuy,ticketBuy,setTicketBuy, objProduct}) {
    const [activeIndex, setActiveIndex] = useState(0);

    const itemRenderer = (item, itemIndex) => {
        const isActiveItem = activeIndex === itemIndex;
        const backgroundColor = isActiveItem ? 'var(--primary-color)' : 'var(--surface-b)';
        const textColor = isActiveItem ? 'var(--surface-b)' : 'var(--text-color-secondary)';

        return (
            <span
                className="inline-flex items-center justify-center rounded-full border-white border h-12 w-12 z-10 cursor-pointer"
                style={{ backgroundColor: backgroundColor, color: textColor, marginTop: '-25px' }}
                onClick={() => setActiveIndex(itemIndex)}
            >
                <i className={`${item.icon} text-xl`} />
            </span>
        );
    };

    const items = [
        {
            icon: 'pi pi-shopping-cart',
            template: (item) => itemRenderer(item, 0)
        },
        {
            icon: 'pi pi-user-plus',
            template: (item) => itemRenderer(item, 1)
        }
        // {
        //     icon: 'pi pi-dollar',
        //     template: (item) => itemRenderer(item, 2)
        // }
    ];

    return (
        <div className="card">
            <Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} className="m-2 py-4 mt-14 sm:mt-2" />
            {activeIndex == 0 ? (
                <ProductSection 
                activeIndex={activeIndex} 
                setActiveIndex={setActiveIndex} 
                ticketBuy={ticketBuy} 
                setTicketBuy={setTicketBuy} 
                dataProductoBuy={dataProductoBuy} 
                setDataProductoBuy={setDataProductoBuy}
                objProduct={objProduct} 
            />
            ):(<></>)}
            {activeIndex == 1 ? (
                <RegisterSection 
                    activeIndex={activeIndex} 
                    setActiveIndex={setActiveIndex}
                    dataPersona={dataPersona}
                    setDataPersona={setDataPersona}
                    ticketBuy={ticketBuy}
                    setTicketBuy={setTicketBuy}
                />
            ):(<></>)}
            {/* {activeIndex == 2 ? (
                <h2>
                Third
                </h2>
            ):(<></>)} */}
        </div>
    )
}