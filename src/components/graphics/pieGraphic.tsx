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
import { Text } from "react-native-svg";

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

export const PieGraphic: FC<pieGraphicProps> = ({data}):JSX.Element => {
  
  const { screenWidth } = useScreenSize();
  const [pieData, setPieData] = useState<any []>(defaultData);
  
  useEffect(() => {
    changeData();
  }, [data])    
  
  const changeData = () => {
    let dataLength = data.length;
    if(!data || dataLength <= 0) return;

    setPieData(data);
  }

  return(

    <View style={styles.container}>
      <PieChart
        data={pieData}
        width={screenWidth - 20}
        height={200}
        chartConfig={chartConf}
        accessor={"population"}
        backgroundColor={'transparent'}
        paddingLeft={"15"}
        avoidFalseZero={true}
        hasLegend={true}
        center={[0, 0]}
        absolute={false}
      />  
    </View>
  )
}

const { blue, bluePink} = chartPallete;
const randomColor = () => bluePink[Math.round(Math.random() * bluePink.length)];

const defaultData: any[] = [{
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

// const defaultData: any[] = [{
//   "color": "#4cc9f0",
//   "legendFontColor": "#23303f",
//   "legendFontSize": "#23303f",
//   "name": "SECORP",
//   "population": 2327891
// },
// {
//   "color": "#480ca8",
//   "legendFontColor": "#23303f",
//   "legendFontSize": "#23303f",
//   "name": "ALARMAS",
//   "population": 27743
// },
// {
//   "color": "#3f37c9",
//   "legendFontColor": "#23303f",
//   "legendFontSize": "#23303f",
//   "name": "VISION",
//   "population": 12742
// },
// {
//   "color": "#480ca8",
//   "legendFontColor": "#23303f",
//   "legendFontSize": "#23303f",
//   "name": "REAL SHINY",
//   "population": 475809
// },
// {
//   "color": "#b5179e",
//   "legendFontColor": "#23303f",
//   "legendFontSize": "#23303f",
//   "name": "CAUDILLOS",
//   "population": 1650
// },
// {
//   "color": "#3a0ca3",
//   "legendFontColor": "#23303f",
//   "legendFontSize": "#23303f",
//   "name": "TOP TICKET",
//   "population": 242107
// },
// {
//   "color": "#480ca8",
//   "legendFontColor": "#23303f",
//   "legendFontSize": "#23303f",
//   "name": "MODEM",
//   "population": 13294
// },
// {
//   "color": "#4895ef",
//   "legendFontColor": "#23303f",
//   "legendFontSize": "#23303f",
//   "name": "PREMIUM PARKING",
//   "population": 1073
// }];

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