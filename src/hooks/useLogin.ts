import { useEffect, useState } from "react";
import { envConfig } from "../../config";
import { Axios } from "axios";

const token = 'Test10019';

export const useLogin = (user: string, password:string ) => {

  const [isLoading, setisLoading] = useState<boolean>(false);
  const [isAuth, setisAuth] = useState<boolean>(false);
  const [data, setData] = useState<any>({status: '', side: ''}); //set default
  
  const urlAuth = `${envConfig.urlBase}usuarios/auth?user=${user.trim()}&password=${password.trim()}`;

  const getAuth = async() => {
    setisLoading(true);
    const response = await fetch(urlAuth, {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'token': token
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
