import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export const useScreenSize = () => {
  const { width, height } = Dimensions.get('window');

  const [screenWidth, setWidth] = useState(width);
  const [screenHeight, setHeight] = useState(height);

  const changeDimensions = () => {
    setWidth(width);
    setHeight(height);
  }

  useEffect(() => {
    changeDimensions();
  }, [width, height])
  
  return {
    screenWidth,
    screenHeight
  }
}

