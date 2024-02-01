import { FC, useState, useEffect } from "react";
import { 
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Image,
  TouchableOpacity
} from "react-native";
import { RootStackParamList } from "../../App";
import { StackScreenProps } from "@react-navigation/stack";
import { currentDay, firstOfMOnth, lastOfMonth } from "../utils/dates";
import { envConfig } from "../../config";
import { useScreenSize, useFetch } from "../hooks";
import { colores, randomColor } from "../utils/colorPallets";
import { LoadingScreen } from "../components/loaders";
import { ItemListNavCard } from "../components/cards";
import { PieGraphic } from "../components/graphics";

type ReceivablePageProps = StackScreenProps<RootStackParamList, 'Receivable'>;

const fechaI = firstOfMOnth();
const lastMonth = lastOfMonth();
const today = currentDay();


export const ReceivablePage:FC<ReceivablePageProps> = ({route, navigation}):JSX.Element => {
  

  //URL AND URL HELPERS
  const unitExist = () => `${route.params?.id ? `&unidad=${route.params.id}`: ''}`;
  const incomeBudgetsUrl = `${envConfig.urlBase}denken/calculosgraficas/presupuestoIngresos?fechaI=${fechaI}&fechaF=${lastMonth || 1}&group=1${unitExist()}`;

  //FETCHS
  const incomeBudgetsFetch = useFetch(incomeBudgetsUrl, 'get');

  //STATES
  const [incomeBudgets, setIncomeBudgets] = useState<any>();
  const [loader, setLoader] = useState<boolean>(true)

  //CUSTOMS
  const { screenWidth } = useScreenSize();

  useEffect(() => {
    if(!incomeBudgetsFetch?.data)
      return;
    setBudgets();
    loaderHelper();
  }, [incomeBudgetsFetch?.isLoading])
  

  //HELPERS
  const setBudgets = () => {
    if(!incomeBudgetsFetch?.data) return;
    
    setIncomeBudgets(incomeBudgetsFetch.data);
  }

  const loaderHelper = () => {
    if(incomeBudgetsFetch?.isLoading) 
      return setLoader(true);

    setTimeout(() => {
      setLoader(false);
    }, 3000);
  }

  //RENDERS 

  const renderBudgets = () => {
    if(!incomeBudgets) return;
    
    const data:any[] = incomeBudgets;

    return data.map((info, index) => {
      return (
        <ItemListNavCard
          name={info.sucursal}
          price={info.total_presupuesto}
          isButton={false}
          isMoney={true}
          background={index%2 == 0 ? colores.primaryDark : colores.success}
          key={index}
        />
      )
    });
  }

  const renderPieChart = () => {
    if(!incomeBudgets) return;
    const data:any[] = incomeBudgets;
    const pieData:any[] = []; 

    data.forEach((data)=> {
        pieData.push({
          name: data.sucursal??'DESCONOCIDO',
          population: Math.round(data.total_presupuesto),
          color: randomColor('cyan') || '#8980F5',
          legendFontColor: colores.textPrimary,
          legendFontSize: 10
        })
    });

    if(!pieData) return;

    return (
      <PieGraphic
        data={pieData}
      />
    )
  }

  return(
    <View style={{...styles.container, width: screenWidth }}>
      {/* EXIT BUTTON */}
      <View style={styles.exitContainer}>
        <TouchableOpacity
          onPress={()=> navigation.navigate('Home')}
          style={styles.exitButton}
        >
          <Image
            source={require('../images/right.png')}
            style={styles.imageExit}
          />
        </TouchableOpacity>
        <Text style={styles.title}>CXC {route.params?.name || ''}</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.cardsContainer}>
          <ScrollView
            horizontal={true}
            scrollEnabled={true}
            stickyHeaderIndices={[1]}
          >
            {
              renderPieChart()
            }
          </ScrollView>
          {
            renderBudgets()
          }
        </View>
      </ScrollView>
      
        
      <LoadingScreen
        isSomething={loader}
      /> 
    
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    position: 'relative'
  },
  scrollContainer: {
    backgroundColor: 'transparent',
    marginBottom: 50
  },
  cardsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  exitContainer: {
    backgroundColor: colores.primary,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  title: {
    color: colores.textSecondary
  },
  exitButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  imageExit: {
    width: 25,
    height: 25,
    transform: [{rotate: '180deg'}]
  }
});
