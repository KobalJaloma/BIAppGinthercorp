import {  
  BarChart
} from "react-native-chart-kit";
import {  
  View, 
  StyleSheet
} from "react-native";
import { chartPallete, colores } from "../../utils/colorPallets";
import { useScreenSize } from "../../hooks";

export const BarGraphic = ():JSX.Element => {

  const { screenWidth } = useScreenSize();

  return(
    <View style={styles.container}>
      <BarChart 
        style={styles.graphic}
        data={data}
        width={screenWidth - 20}
        height={220}
        yAxisLabel="$"
        yAxisSuffix=""
        chartConfig={chartConfig}
        verticalLabelRotation={0}        
      />
    </View>
  )
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
  }
});

const data = {
  labels: ["SECORP", "ALARMAS", "REAL SHINY", "CAUDILLOS"],
  datasets: [
    {
      data: [100, 25, 32, 10]
    }
  ]
};

const chartConfig = {
  backgroundColor: colores.primary,
  backgroundGradientFrom: colores.success,
  backgroundGradientTo: colores.primary,  
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 3, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false
}