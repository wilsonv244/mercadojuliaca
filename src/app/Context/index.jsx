import { createContext, useState, useEffect } from 'react'

export const VarGlobalContext = createContext()

export const VarGlobalProvider = ({children}) => {
  const [colorText, setColorText] = useState('#4F2D7F');
  const [colorPrimary, setColorPrimary] = useState('#4F2D7F');
  const [count, setCount] = useState(0)

  return (
    <VarGlobalContext.Provider value={{
      colorText,
      setColorText,
      count,
      setCount,
    }}>
      {children}
    </VarGlobalContext.Provider>
  )
}