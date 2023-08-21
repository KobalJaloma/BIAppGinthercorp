import React,{ createContext, useContext, useState} from "react";

const authContext = createContext();

export const authProvider= ({children}) => {
  const [data, setData] = useState();

  return(
    <authContext.Provider value={{
      data, 
      setData
    }}>
      {children}
    </authContext.Provider>    
  );
}