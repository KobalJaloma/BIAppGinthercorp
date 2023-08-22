import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useFetch = (url:string, type: string) => {
  const [data, setData] = useState();
  const [isLoading, setisLoading] = useState<boolean>(false);

  if(!url || !type) return;

  const get = async() => {
    setisLoading(true);
    const response = await fetch(url, {
      headers: {  
        'content-Type': 'application/json;charset=UTF-8',
        'token' : 'Test10019'
      }
    });
    const data = await response.json();
    
    if(!data || data?.status == 'ERROR' || data?.status == 'FAIL') {
      Alert.alert("Hubo Un Error: " + data.message);
      return;
    }

    setData(data);
    setisLoading(false);
  }

  const post = async() => {
    setisLoading(true);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'token': 'Test10019'
      }
    });
    const data = await response.json();
    if(!data || data.status == 'ERROR' || data.status == 'FAIL') {
      Alert.alert('Hubo Un Error: ' + data.message);
      return;
    }

    setData(data);
  }

  const selector = () => {
    var typeLow = type.toLowerCase();
    switch (typeLow) {
      case 'post':
        post();  
      break;
      case 'get':
        get();
      break;
      default:
        Alert.alert("Peticion Estructurada De Forma Erronea")
      break;
    }
  }
  useEffect(() => {
    selector();
  }, [url])
  
  return {
    data,
    isLoading
  }
}