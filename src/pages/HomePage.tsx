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
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackNavigationProp } from "@react-navigation/stack"; 
import { colores, chartPallete, currentDay, firstOfMOnth, yesterday, lastOfMonth } from '../utils';
import { HeaderStateCard, AccountStateCard, ItemListNavCard } from "../components/cards";
import { useScreenSize, useFetch } from "../hooks";
import { LineGraphic, PieGraphic, BarGraphic } from "../components/graphics";
import { RootStackParamList } from "../../App";
import { envConfig } from "../../config";
import { LoadingScreen } from "../components/loaders";


type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

const fechaI = firstOfMOnth();
const fechaF = currentDay();
const yesterdayDate = yesterday(); 
const lastMonth = lastOfMonth();

const url = `${envConfig.urlBase}denken/calculosgraficas/balances?fechaI=${fechaI}&fechaF=${fechaF}`;
const urlToday = `${envConfig.urlBase}denken/calculosgraficas/balances?fechaI=${yesterdayDate}&fechaF=${fechaF}`;
const urlCancelBills = `${envConfig.urlBase}denken/calculosgraficas/facturas_canceladas?fechaI=${fechaI}&fechaF=${fechaF}&count=1`;
const incomeBudgetsUrl = `${envConfig.urlBase}denken/calculosgraficas/presupuestoIngresos?fechaI=${fechaI}&fechaF=${lastMonth || 1}`;
const urlAccountsReceivable = `${envConfig.urlBase}denken/calculosgraficas/totalesCxc?fechaI=${fechaI}&fechaF=${lastMonth}`;

export const Home: FC<HomeScreenProps> = ({navigation}):JSX.Element => {
  
  const balanceFetch = useFetch(url, 'get');
  const balanceUpdatedFetch = useFetch(urlToday, 'get');
  const cancelBills = useFetch(urlCancelBills, 'get');
  const incomeBudgetsFetch = useFetch(incomeBudgetsUrl, 'get');
  const accountsReceivableFetch = useFetch(urlAccountsReceivable, 'get');

  const { screenHeight, screenWidth } = useScreenSize();
  const [budgets, setBudgets] = useState({
    expense: '0.0',
    income: '0.0',
    utility: '0.0'
  })
  const [cancelBillsCounter, setCancelBillsCounter] = useState<string>('0');
  const [incomeBudgets, setIncomeBudgets] = useState<string>('0');
  const [accountsReceivable, setAccountsReceivable] = useState<any>('0')
  const [barChart, setbarChart] = useState<any>({
    label: [],
    data: [],
  })
  const [pieChart, setPieChart] = useState<any []>([]);
  const [loader, setLoader] = useState<boolean>(false);
  
  useEffect(() => {
    if(!balanceFetch) return;
    calculatedBudgets();
    incomeCalculations();
    loaderHelper(balanceFetch.isLoading);
  }, [balanceFetch?.isLoading])

  useEffect(() => {
    if(!cancelBills?.isLoading) 
      billsCalculation();
  }, [cancelBills?.isLoading])

  useEffect(() => {
    if(!incomeBudgetsFetch) return;

    if(!incomeBudgetsFetch?.isLoading)
      incomeBudgetsCalculations();

    loaderHelper(incomeBudgetsFetch.isLoading);
  }, [incomeBudgetsFetch?.isLoading])
  
  useEffect(() => {
    if(!accountsReceivableFetch) return;

    if(!accountsReceivableFetch?.isLoading )
      accountsReceivableCalculations();

    loaderHelper(accountsReceivableFetch.isLoading);
  }, [accountsReceivableFetch?.isLoading])
  
  // COMPONENT RENDERS
  const RenderHeaderStateCards = () => {
    if(!balanceUpdatedFetch?.data)
      return;
    
    const prov:any [] = balanceUpdatedFetch.data;
    console.log(prov);
  
    if(prov.length == 0) 
      return <HeaderStateCard 
        unit={''}
        price={''}
        isEmpty={true}
      /> 
    
    return prov.map( (data, index) => {
      
      let total = data.SALDO;
      
      if(total < 0) {
        total = (total) * -1; //change value to positive
        return <HeaderStateCard 
          unit={data.FAMILIA}
          price={moneyFormat(total)}
          arrow={false}
          key={index}
        /> 
      }
      
      if(total == 0) {
        total = (total) * 1; //change value to positive
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
          color: randomColor() || '#8980F5',
          legendFontColor: colores.textPrimary,
          legendFontSize: 10
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

  const incomeBudgetsCalculations = () => {
    if(!incomeBudgetsFetch?.data) return;

    const prov:any = incomeBudgetsFetch.data[0];
    setIncomeBudgets(prov.total_presupuesto);
  }
  
  const accountsReceivableCalculations = () => {
    if(!accountsReceivableFetch?.data) return;

    const data:any = accountsReceivableFetch.data;
    setAccountsReceivable(data[0].total_cxc); // se debe cambiar a cxp el query en backend

  }

  const loaderHelper = (isLoading: boolean) => {
    if(isLoading) 
      return setLoader(true);

    setTimeout(() => {
      setLoader(false);
    }, 3000);
  }


  const navigateToBranch = (id: string, name: string, income:number, expense:number, utility:number,) => {
    navigation.navigate('Unit', { id: id, name: name, income: income, expense: expense, utility: utility});
  }

  const moneyFormat = (num: number) => {
    return num.toLocaleString('en').toString();
  }

  const test = () => {
    balanceFetch?.reload();
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
        {/* <TouchableOpacity
          onPress={() => balanceFetch?.reload()}
          style={styles.reloadMainContainer}
        >
          <View style={styles.reloadContainer}>
              <Image
                source={require('../images/refresh-icon-white.png')}
                style={styles.reloadImg}
              />
          </View> 
        </TouchableOpacity> */}
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
          {/* <LineGraphic /> */}
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
            name="CXC"
            price={incomeBudgets}
            isButton={true}
            fn={()=> navigation.navigate('Receivable')}
          />
          <ItemListNavCard 
            name="CXP"
            price={accountsReceivable}
            isButton={false}
            fn={()=> navigation.navigate('Receivable')}
          />
          <ItemListNavCard 
            name="Ingresos"
            price={budgets.income}
            isButton={false}  
          />
          <ItemListNavCard 
            name="Egresos"
            price={budgets.expense}
            isButton={false}
          />
          <ItemListNavCard 
            name="Utilidad Neta"
            price={budgets.utility}
            isButton={false}
          />
          <ItemListNavCard 
            name="Presupuesto Utilidad"
            price={(parseFloat(incomeBudgets) - parseFloat(budgets.expense) - parseFloat(accountsReceivable)).toString()}
            isButton={false}
          />
          <ItemListNavCard 
            name="Facturas Canceladas"
            price={cancelBillsCounter}
            isButton={false}
            isMoney={false}
          />
          {/* <ItemListNavCard 
            name="testButton"
            price={'0'}
            isButton={true}
            isMoney={false}
            fn={() => navigation.navigate('Test')}
          /> */}
        </View>
      </ScrollView>
       
      <LoadingScreen
        isSomething={loader}
      />
      
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
  reloadMainContainer: {
    // position: 'absolute',
    top: -100,
    right: -100,
    zIndex: 100,
    width: 100,
    height: 100,
    backgroundColor: 'yellow'
  },
  reloadContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  reloadImg: {
    width: 30,
    height: 30
  }
});

const { blue, bluePink, cyan} = chartPallete;

const randomColor = () => cyan[Math.round(Math.random() * (cyan.length-1))];
