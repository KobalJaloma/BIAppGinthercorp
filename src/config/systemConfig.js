import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

//ALL USER CONFIGS SETS
export const systemConfigDefault = {
  movementLimit: 10,
}

// export const systemConfig = (types) => {
//   const [data, setData] = useState();
//   const [isLoading, setIsLoading] = useState(false);

//   if(!types) return;

//   const selector = () => {
//     var type = types;

//     switch (type) {
//       case 'save':
//         saveData();
//         break;
//       case '':
//         getConfigData(); 
//         break;
//       default:
//         break;
//     }
//   }



// }



export const saveData = async(data) => {
  try {
      const prev = {...systemConfigDefault, ...data ?? ''};

      await AsyncStorage.setItem('config', JSON.stringify(prev));
  
  } catch (error) { 
      
  }
}

export const getConfigData = async() => {
  try {
      const data = await AsyncStorage.getItem('config');
      if(!data) 
        return 

      return JSON.parse(data);
  } catch (error) {
    
  }
}

