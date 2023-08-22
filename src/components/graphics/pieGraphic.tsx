import {  
  PieChart
} from "react-native-chart-kit";
import { FC } from "react";
import {  
  View,
  StyleSheet
} from "react-native";
import { colores, chartPallete } from "../../utils/colorPallets";
import { useScreenSize } from "../../hooks";

type pieGraphicProps = {
  data: Object
}

export const PieGraphic: FC<pieGraphicProps> = ({data = testData}):JSX.Element => {
  
  const { screenWidth } = useScreenSize();

  return(
    <View style={styles.container}>
      <PieChart
        data={testData}
        width={screenWidth - 20}
        height={200}
        chartConfig={chartConf}
        accessor={"population"}
        backgroundColor={'transparent'}
        paddingLeft={"15"}
        center={[0, 0]}
        absolute={false}
        
        />
    </View>
  )
}

const { blue, bluePink} = chartPallete;
const randomColor = () => bluePink[Math.round(Math.random() * bluePink.length)];

const testData = [ 
  {
    name: "SECORP",
    population: 21500000,
    color: randomColor(),
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "REAL SHINY",
    population: 2800000,
    color: randomColor(),
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "SECORP ALARMAS",
    population: 527612,
    color: randomColor(),
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "DRIVER PLEASE",
    population: 8538000,
    color: randomColor(),
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "SABOR A MEXA",
    population: 11920000,
    color: randomColor(),
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
}
];

const chartConf = {
  backgroundColor: colores.primary,
  backgroundGradientFrom: colores.primaryDark,
  backgroundGradientTo: colores.primary,  
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 3, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false
}

const styles = StyleSheet.create({
  container: {
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
});