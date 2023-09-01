import { FC, useEffect, useState } from "react";
import {  
  BarChart
} from "react-native-chart-kit";
import {  
  View, 
  StyleSheet,
  TouchableOpacity,
  Image,
  Text
} from "react-native";
import { chartPallete, colores } from "../../utils/colorPallets";
import { useScreenSize } from "../../hooks";

type BarGraphic = {
  labels?: string[];
  dataSets: number[];
  barConfig?: barConfig;
  height?: number;
  widthScale?: number;
  verticalLabelRotation?: number;
  showValuesOnTopOfBars?: boolean;
  activeOpacityAnim?: boolean;
}
type barConfig = { 
  strokeWidth?: number, // optional, default 3
  barPercentage?: number,
  useShadowColorFromDataset?: boolean, 
  decimalPlaces?: number
}

export const BarGraphic: FC<BarGraphic> = (
  {
    dataSets = dataDefault.datasets, 
    labels = dataDefault.labels, 
    barConfig, 
    height = 250, 
    widthScale = 1, 
    verticalLabelRotation = 0,
    activeOpacityAnim = false
  }
):JSX.Element => {

  const { screenWidth } = useScreenSize();
  const [isVisibleTop, setIsVisibleTop] = useState<boolean>(false);
  
  // LISTENER TO CHANGE VISIBILTY OF TOP NUMBERS
  useEffect(() => {
    setIsVisibleTop(activeOpacityAnim);
  }, [activeOpacityAnim]);

  const handleVisibilityTop = () => {
    setIsVisibleTop(!isVisibleTop);
  }

  return(
    <TouchableOpacity 
      style={styles.container}
      onPress={handleVisibilityTop}
      activeOpacity={1}
    >
      <BarChart 
        style={styles.graphic}
        data={{
          labels: labels,
          datasets: [
            {
              data: dataSets
            }
          ]
        }}
        width={screenWidth * widthScale}
        height={height}
        yAxisLabel="$"
        yAxisSuffix="k"
        chartConfig={{...chartConfigDefault, ...barConfig}}
        verticalLabelRotation={verticalLabelRotation}   
        showValuesOnTopOfBars={isVisibleTop}     
        withHorizontalLabels={true}
        showBarTops={true}
      />
      <View style={styles.feedbackContainer}>
        
        
        {
          isVisibleTop
          ?<Image 
            source={require('../../images/eyeOpen.png')}
            style={styles.feedbackImage}
          />
          :<Image 
            source={require('../../images/eyeClose.png')}
            style={styles.feedbackImage}
          />
        }
      </View>
    </TouchableOpacity>
  )
}

const dataDefault = {
  labels: ["SECORP", "ALARMAS", "REAL SHINY", "CAUDILLOS"],
  datasets: [100, 25, 32, 10,100, 25, 32, 10, 100, 25, 32, 10,100, 25, 32, 10, 100, 25, 32, 10]
};

const chartConfigDefault = {
  backgroundColor: colores.primary,
  backgroundGradientFrom: colores.success,
  backgroundGradientTo: colores.primary,  
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 3, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  decimalPlaces: 0
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 10
  },
  graphic: {
    borderRadius: 16
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 15,
    left: 25,
  },
  feedbackImage: {
    width: 20,
    height: 20
  }
});