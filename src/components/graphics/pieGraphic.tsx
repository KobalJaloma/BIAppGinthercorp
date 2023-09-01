import {  
  PieChart
} from "react-native-chart-kit";
import { FC, useEffect, useState } from "react";
import {  
  View,
  StyleSheet,
} from "react-native";
import { colores, chartPallete } from "../../utils/colorPallets";
import { useScreenSize } from "../../hooks";

type pieGraphicProps = {
  data: any[]
}

export type dataGraphic = {
    name: string,
    population: number,
    color: string,
    legendFontColor: string,
    legendFontSize: 15
}

export const PieGraphic: FC<pieGraphicProps> = ({data = defaultData}):JSX.Element => {
  
  const { screenWidth } = useScreenSize();
  const [pieData, setPieData] = useState<dataGraphic[]>();

  return(
    <View style={styles.container}>
      <PieChart
        data={pieData??defaultData}
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

const defaultData: dataGraphic[] = [{
    name: "Seoul",
    population: 21500000,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Toronto",
    population: 2800000,
    color: "#F00",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Beijing",
    population: 527612,
    color: "red",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "New York",
    population: 8538000,
    color: "#F23FA3",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  },
  {
    name: "Moscow",
    population: 11920000,
    color: "rgb(0, 0, 255)",
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