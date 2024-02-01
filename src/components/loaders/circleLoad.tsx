import { FC, useState } from "react";
import {  
  View,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useScreenSize } from "../../hooks";
import { colores } from "../../utils/colorPallets";

type LoadingScreenProps = {
  isSomething: boolean
}

export const LoadingScreen: FC<LoadingScreenProps> = ({isSomething}):JSX.Element => {
  
  const { screenHeight, screenWidth } = useScreenSize();
  
  return (
    isSomething
    ? <View style={{...stylesLoad.container, width: screenWidth, height: screenHeight}}>
        <ActivityIndicator
          size={'large'}
          color={colores.textSecondary}
        />
      </View>
    : <View></View>
  )
}

const stylesLoad = StyleSheet.create({
  container: {
      backgroundColor: colores.primary  ,
      zIndex: 10,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
  }
});