import { 
  View,
  Button,
  Text
} from "react-native";
import { FC, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { getConfigData, saveData } from "../config/systemConfig";

type TestPageProps = StackScreenProps<RootStackParamList, 'Test'>;


export const TestPage: FC<TestPageProps> = ({navigation}):JSX.Element => {

  const [config, setConfig] = useState<any>('');

  const save = () => {
    saveData({test1: 15});
  }
  
  const get = async() => {
    const data = await getConfigData();
    if(!data) return;
    setConfig(data)
  
  }

  return(
    <View>
      <Button 
        title="Save"
        onPress={save}
      />
      <Button 
        title="get"
        onPress={get}
      />
      <Text style={{color: 'black'}}>
        {JSON.stringify(config)}
      </Text>
    </View>
  )

}