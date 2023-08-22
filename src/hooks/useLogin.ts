import { useEffect, useState } from "react";
import { Axios } from "axios";

export const useLogin = (user: string, password:string ) => {

  const [isLoading, setisLoading] = useState<boolean>(false);
  const [isAuth, setisAuth] = useState<boolean>(false);
  const [data, setData] = useState<any>({status: '', side: ''}); //set default
  
  const urlAuth = `http://52.10.24.248/api/usuarios/auth?user=${user}&password=${password}`;

  const getAuth = async() => {
    setisLoading(true);
    const response = await fetch(urlAuth, {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'token': 'Test10019'
      }
    });
    const data = await response.json();
    setData(data);

    if(data.status == 'ERROR' || data.status == 'FAIL'){
      setisLoading(false);
      setisAuth(false);
      return;
    }

    setisLoading(false);
    setisAuth(true);
  }

  useEffect(() => {
    getAuth();
  }, [user, password])
  
  return {
    isAuth,
    isLoading, 
    data
  }
}
