import { FC, useEffect, useState } from "react";
import { 
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  Alert
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack"; 
import { colores, chartPallete, currentDay, firstOfMOnth } from '../utils';
import { HeaderStateCard, AccountStateCard, ItemListNavCard } from "../components/cards";
import { useScreenSize, useFetch } from "../hooks";
import { LineGraphic, PieGraphic, BarGraphic } from "../components/graphics";
import { RootStackParamList } from "../../App";
import { envConfig } from "../../config";

// IMPORT TYPES
import { dataGraphic } from "../components/graphics/pieGraphic";


type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}
type LoadingScreenProps = {
  isSomething: boolean
}

const fechaI = firstOfMOnth();
const fechaF = currentDay();

const url = `${envConfig.urlBase}denken/calculosgraficas/balances?fechaI=${fechaI}&fechaF=${fechaF}`;


export const Home: FC<HomeScreenProps> = ({navigation}):JSX.Element => {
  
  const balanceFetch = useFetch(url, 'get');
  const { screenHeight, screenWidth } = useScreenSize();
  const [budgets, setBudgets] = useState({
    egresos: '0.0',
    ingresos: '0.0',
    utilidad: '0.0'
  })
  const [barChart, setbarChart] = useState<any>({
    label: [],
    data: [],
  })
  const [pieChart, setPieChart] = useState<any[]>([]);


  useEffect(() => {
    budgetsCalculated();
    incomeCalculations();
  }, [balanceFetch?.isLoading])
  
  const RenderStateCards = () => {
    if(balanceFetch?.data) {
      
      const units:any[] = balanceFetch.data;
      let i = 0;
      return units.map( unit => {
        const egreso = parseFloat(unit.PRESUPUESTO?? '0');
        const ingreso = parseFloat(unit.EJERCIDO?? '0');
        let utilidad = ingreso - egreso;
        let utilidadFormat:string = utilidad.toLocaleString('en').toString();
        
        i++;
        return (
          <AccountStateCard
            price={ utilidad.toString() ?? 'NO DATA'}
            unit={(unit.FAMILIA ) ?? 'DESCONOCIDO'} 
            OnUse={   
              () => navigateToBranch(unit.id_unidad_negocio?? 0,unit.FAMILIA?? 'DESCONOCIDO', utilidadFormat)
            }
            key={i}
          />
        )
      }
      );
    }
  }

  const RenderBarGraphic = () => {
    if(barChart.label.length != 0) {
      console.log('En Render Graf');
      console.log(JSON.stringify(barChart));
      // console.log('Lenght: ' + barChart.label.length);
      return (
        <BarGraphic 
            labels={barChart.label}
            dataSets={barChart.dataSets}
            barConfig={{
              barPercentage: 0.5
            }}
            widthScale={1+(barChart.label.length / 10)}
            height={300}
            verticalLabelRotation={20}
            showValuesOnTopOfBars={false}
        /> 
      )
    }
  }

  const RenderPieGraphic = () => {
      if(pieChart) {
        console.log(pieChart);
        
        return (
          <PieGraphic
            data={pieChart}
          />
        )
      }
  }
  
  const budgetsCalculated = () => {
    let egresos = 0;
    let ingresos = 0;
    let utilidad = 0;

    if(!balanceFetch?.data)
      return;
    
    const data:any[] = balanceFetch.data;

    data.map( units => {
      egresos += parseFloat(units.PRESUPUESTO?? 0);
      ingresos += parseFloat(units.EJERCIDO?? 0);
    });

    utilidad = ingresos - egresos;
    
    // console.log(`utilidad: ${utilidad} \n ingresos: ${ingresos} \n egresos" ${egresos}`);
    
    setBudgets({
      ...budgets,
      egresos: egresos.toString(),
      ingresos: ingresos.toString(),
      utilidad: utilidad.toString()
    })
  }

  const incomeCalculations = () => {    
    let labels: string[] = [];
    let stats: any[] = [];

    if(!balanceFetch?.data)
      return;

    const data:any[] = balanceFetch.data;
    
    data.forEach( unit => {
      if(unit.EJERCIDO != 0) {
        labels.push(unit.FAMILIA??'DESCONOCIDO');
        stats.push( (Math.round(unit.EJERCIDO)/1000 ) ?? 0);

        setPieChart(prev => [...prev, {
          name: unit.FAMILIA,
          population: unit.EJERCIDO,
          color: randomColor(),
          legendFontColor: colores.textPrimary,
          legendFontSize: colores.textPrimary
        }]);
      }
    } );
    
    setbarChart({
      label: labels,
      dataSets: stats
    })
    
  }

  const navigateToBranch = (id: string, name: string, balanceMoney:string) => {
    navigation.navigate('Unit', { id: id, name: name, balanceMoney: balanceMoney});
  }

  return(
    <SafeAreaView>
      <StatusBar backgroundColor={'white'}/>
      <View style={styles.seccionTop}>
        <ScrollView
          horizontal
          scrollEnabled={true}
          stickyHeaderIndices={[1]}
        >
          <HeaderStateCard 
            unit="Secorp"
            price="10,234,244.00"
            arrow={false}
          />
          <HeaderStateCard 
            unit="Secorp"
            price="234,244.00"
            arrow={true}
          />
        </ScrollView>
        <View style={styles.dockBottom}>
          <View style={styles.dockTextContainer}>
            <Text style={styles.dockText}>UNIDADES DE NEGOCIO</Text>
          </View>
        </View>
        <View style={styles.dockPriceIndicator}/> 
      </View>
      <ScrollView 
        style={{...styles.scrollContainer, height: screenHeight-200}}
        scrollEnabled={true}
      >
        <ScrollView 
          style={{...styles.scrollContainerCarousel}}
          horizontal
        >
          {
             RenderStateCards() 
          }
        </ScrollView>
        {/* TEST GRAPHICS */}
        <LineGraphic />
       
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
          <Text style={styles.dockText}>Ingresos Por Unidad</Text>
        </View>
        <ScrollView 
          horizontal
          style={{...styles.scrollViewGraphic, width: screenWidth - 10}}
        >
          {
            RenderBarGraphic()
          }
        </ScrollView>
          
        {/* <PieGraphic/> */}
        {
          RenderPieGraphic()
        }

        <View style={styles.containerList}>
          <ItemListNavCard 
            name="Presupuesto ingresos"
            price={budgets.ingresos}
            />
          <ItemListNavCard 
            name="Presupuesto egresos"
            price={budgets.egresos}
          />
          <ItemListNavCard 
            name="Utilidades"
            price={budgets.utilidad}
          />
        </View>
      </ScrollView>
      {
        balanceFetch?.isLoading && 
        <LoadingScreen
          isSomething={balanceFetch?.isLoading}
        />
      }
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  seccionTop: {
    backgroundColor: colores.primary,
    position: 'relative',
    paddingVertical: 50,
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dockBottom: {
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 2,
    paddingVertical: 30,
    margin: 0,
    bottom:-30,
    right: 0,
    left: 0,
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30
  },
  dockPriceIndicator: {
    backgroundColor: colores.primary,
    position: 'absolute',
    zIndex: 3,
    paddingVertical: 10,
    margin: 0,
    bottom: 30,
    right: 180,
    left: 180,
    borderBottomEndRadius: 50,
    borderBottomLeftRadius: 50
  },
  dockTextContainer: {
    zIndex: 4,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center'
  },
  dockText: {
    fontSize: 20,
    color: colores.primary,
    marginHorizontal: 20,
    fontWeight: '700'
  },
  scrollContainerCarousel: {
    backgroundColor: 'transparent',
    height: 200,
    marginBottom: 10
  },
  scrollContainer: {
    height: 610,
    backgroundColor: 'transparent'
  },
  containerList: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  testContainers: {
    height: 200,
    backgroundColor: 'white'
  },
  scrollViewGraphic: {
    overflow: 'hidden'
  }
});


const LoadingScreen: FC<LoadingScreenProps> = ({isSomething}):JSX.Element => {
  
  const { screenHeight, screenWidth } = useScreenSize();
  
  return (
    isSomething
    ? <View style={{...stylesLoad.container, width: screenWidth, height: screenHeight}}>
        <Text style={{fontSize: 50, color: 'white'}}>...loading</Text>
      </View>
    : <View></View>
  )
}

const { blue, bluePink} = chartPallete;
const randomColor = () => bluePink[Math.round(Math.random() * bluePink.length)];

const stylesLoad = StyleSheet.create({
  container: {
    backgroundColor: colores.primary  ,
    zIndex: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  }
});