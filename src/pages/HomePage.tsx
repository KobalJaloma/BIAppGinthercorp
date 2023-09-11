import { FC, useEffect, useState } from "react";
import { 
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator
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
import { TouchableOpacity } from "react-native-gesture-handler";


type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}
type LoadingScreenProps = {
  isSomething: boolean
}

const fechaI = firstOfMOnth();
const fechaF = currentDay();

const url = `${envConfig.urlBase}denken/calculosgraficas/balances?fechaI=${fechaI}&fechaF=${fechaF}`;
const urlToday = `${envConfig.urlBase}denken/calculosgraficas/balances?fechaI=${'2023-09-07'}&fechaF=${'2023-09-07'}`;
const urlCancelBills = `${envConfig.urlBase}denken/calculosgraficas/facturas_canceladas?fechaI=${fechaI}&fechaF=${fechaF}&count=1`

export const Home: FC<HomeScreenProps> = ({navigation}):JSX.Element => {
  
  const balanceFetch = useFetch(url, 'get');
  const balanceUpdatedFetch = useFetch(urlToday, 'get');
  const cancelBills = useFetch(urlCancelBills, 'get');

  const { screenHeight, screenWidth } = useScreenSize();
  const [budgets, setBudgets] = useState({
    expense: '0.0',
    income: '0.0',
    utility: '0.0'
  })
  const [cancelBillsCounter, setCancelBillsCounter] = useState<string>('0');
  const [barChart, setbarChart] = useState<any>({
    label: [],
    data: [],
  })
  const [pieChart, setPieChart] = useState<any []>([]);

  useEffect(() => {
    calculatedBudgets();
    incomeCalculations();
  }, [balanceFetch?.isLoading])

  useEffect(() => {
    if(!cancelBills?.isLoading) 
      billsCalculation();

  }, [cancelBills?.isLoading])

  // COMPONENT RENDERS
  const RenderHeaderStateCards = () => {
    if(!balanceUpdatedFetch?.data)
      return;

    const prov:any [] = balanceUpdatedFetch.data;
  
    if(prov.length == 0) 
      return;
    
    return prov.map( (data, index) => {
      
      let total = data.SALDO;
      console.log('este es el total' + total);
      
      if(total < 0) {
        total = (total) * -1; //change value to positive
        return <HeaderStateCard 
          unit={data.FAMILIA}
          price={moneyFormat(total)}
          arrow={false}
          key={index}
        /> 
      }

      if(total > 0) {
        return <HeaderStateCard 
          unit={data.FAMILIA}
          price={moneyFormat(total)}
          arrow={true}
          key={index}
        /> 
      }

    })

  }
  
  const RenderStateCards = () => {
    if(balanceFetch?.data) {
      
      const units:any[] = balanceFetch.data;

      return units.map( (unit, index) => {
        const expense = parseFloat(unit.PRESUPUESTO?? '0');
        const income = parseFloat(unit.EJERCIDO?? '0');
        let utility = income - expense;

        return (
          <AccountStateCard
            price={ utility.toString() ?? 'NO DATA'}
            unit={(unit.FAMILIA ) ?? 'DESCONOCIDO'} 
            OnUse={   
              () => navigateToBranch (
                unit.id_unidad_negocio?? 0,
                unit.FAMILIA?? 'DESCONOCIDO',
                income,
                expense, 
                utility 
              )
            }
            key={index}
          />
        )
      }
      );
    }
  }

  const RenderBarGraphic = () => {
    if(barChart.label.length != 0) {
      // console.log('Lenght: ' + barChart.label.length);
      return (
        <BarGraphic 
            labels={barChart.label}
            dataSets={barChart.dataSets}
            barConfig={{
              barPercentage: 0.5
            }}
            widthScale={1+(barChart.label.length / 20)}
            height={300}
            verticalLabelRotation={20}
            showValuesOnTopOfBars={false}
            isRounded={true}
        /> 
      )
    }
  }

  const RenderPieGraphic = () => { 
      if(!pieChart)
        return;

      return (
        <PieGraphic
          data={pieChart}
        />
      )
      
  }

  // REQUIRE CALCULATIONS FOR RENDERS
  const calculatedBudgets = () => {
    let expense = 0;
    let income = 0;
    let utility = 0;

    if(!balanceFetch?.data)
      return;
    
    const data:any[] = balanceFetch.data;

    data.map( units => {
      expense += parseFloat(units.PRESUPUESTO?? 0);
      income += parseFloat(units.EJERCIDO?? 0);
    });

    utility = income - expense;
    
    setBudgets({
      ...budgets,
      expense: expense.toString(),
      income: income.toString(),
      utility: utility.toString()
    })
  }

  const incomeCalculations = () => {    
    let labels: string[] = [];
    let stats: any[] = [];

    if(!balanceFetch?.data)
      return;

    const data:any[] = balanceFetch.data;
    const pieData:any[] = [];
    
    data.forEach( unit => {
      if(unit.EJERCIDO != 0) {
        labels.push(unit.FAMILIA??'DESCONOCIDO');
        stats.push( (Math.round(unit.EJERCIDO)/1000 ) ?? 0);

        pieData.push({
          name: unit.FAMILIA??'DESCONOCIDO',
          population: Math.round(unit.EJERCIDO),
          color: randomColor(),
          legendFontColor: colores.textPrimary,
          legendFontSize: 15
        });
      }
    } );
    
    setbarChart({
      label: labels,
      dataSets: stats
    })

    setPieChart(pieData);
    
  }

  const billsCalculation = () => {
    if(!cancelBills?.data) 
      return;
    const prov:any = cancelBills.data[0];
    setCancelBillsCounter(prov.canceladas.toString()??'0');
  }

  const navigateToBranch = (id: string, name: string, income:number, expense:number, utility:number,) => {
    navigation.navigate('Unit', { id: id, name: name, income: income, expense: expense, utility: utility});
  }

  const moneyFormat = (num: number) => {
    return num.toLocaleString('en').toString();
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
          {
            RenderHeaderStateCards()
          }
        </ScrollView>
        <View style={styles.dockBottom}>
          <View style={styles.dockTextContainer}>
            <Text style={styles.dockText}>UNIDADES DE NEGOCIO</Text>
          </View>
        </View>
        <View style={styles.dockPriceIndicator}/> 
        {/* RELOAD BUTTON */}
        <TouchableOpacity
          onPress={() => balanceFetch?.reload()}
        >
          <View style={styles.reloadContainer}>
              <Image
                source={require('../images/refresh-icon-white.png')}
                style={styles.reloadImg}
              />
          </View>
        </TouchableOpacity>
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
        <View>
          <LineGraphic />
        </View>
        <ScrollView 
          horizontal
          style={{...styles.scrollViewGraphic, width: screenWidth - 10}}
        >
          {
            RenderBarGraphic()
          }
        </ScrollView>
        <View>
          {
            RenderPieGraphic()
          }
        </View>
        <View style={styles.containerList}>
          <ItemListNavCard 
            name="Presupuesto ingresos"
            price={budgets.income}
            isButton={false}
            />
          <ItemListNavCard 
            name="Presupuesto egresos"
            price={budgets.expense}
            isButton={false}
          />
          <ItemListNavCard 
            name="Utilidades"
            price={budgets.utility}
            isButton={false}
          />
          <ItemListNavCard 
            name="Facturas Canceladas"
            price={cancelBillsCounter}
            isButton={false}
            isMoney={false}
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
    marginVertical: 10,
    paddingBottom: 40
  },
  testContainers: {
    height: 200,
    backgroundColor: 'white'
  },
  scrollViewGraphic: {
    overflow: 'hidden'
  },
  reloadContainer: {
    position: 'absolute',
    top: 15,
    right: 10,
    zIndex: 10
  },
  reloadImg: {
    width: 30,
    height: 30
  }
});


const LoadingScreen: FC<LoadingScreenProps> = ({isSomething}):JSX.Element => {
  
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