import { FC, useEffect } from "react";
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
import { colores } from '../utils/colorPallets';
import { HeaderStateCard, AccountStateCard, ItemListNavCard } from "../components/cards";
import { useScreenSize, useFetch } from "../hooks";
import { LineGraphic, PieGraphic, BarGraphic } from "../components/graphics";
import { RootStackParamList } from "../../App";
import { envConfig } from "../../config";


type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}
const fechaI = '2023-08-01';
const fechaF = '2023-08-024';

const url = `${envConfig.urlBase}denken/calculosgraficas/balances?fechaI=${fechaI}&fechaF=${fechaF}`;

export const Home: FC<HomeScreenProps> = ({navigation}):JSX.Element => {
  
  const balanceFetch = useFetch(url, 'get');
  const { screenHeight, screenWidth } = useScreenSize();
  

  useEffect(() => {
    console.log(JSON.stringify(balanceFetch?.data));
    
  }, [url])
  
  const RenderBalance = () => {
    if(balanceFetch?.data ) {
      return(
        <View></View>
      )
    }
  }
  
  const navigateToBranch = (id: string, name: string) => {
    navigation.navigate('Unit', { id: id, name: name});
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
          {
           
          }
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
          <AccountStateCard 
            unit="Secorp"
            price="4.348.975.98"
            ruta="Secorp"
            function={() => {navigateToBranch('1', "Secorp")}}
            />
          <AccountStateCard 
            unit="real shiny"
            price="300,245.98"
            ruta="Real Shiny"
            function={() => {navigateToBranch('2', "Real Shiny")}}
            />
          <AccountStateCard 
            unit="Driver Please"
            price="300,245.98"
            ruta="Driver Please"
            function={() => {navigateToBranch('3', "Driver Please")}}
          />
        </ScrollView>
        {/* TEST GRAPHICS */}
        <LineGraphic />
        <ScrollView 
          horizontal
        >
          <BarGraphic />
          <BarGraphic />
        </ScrollView>
        <PieGraphic data={{}}/>
        <View style={styles.containerList}>
          <ItemListNavCard 
            name="Presupuesto ingresos"
            price="63,007,033.90"
            />
          <ItemListNavCard 
            name="Presupuesto egresos"
            price="14,667,752.90"
          />
          <ItemListNavCard 
            name="Utilidades"
            price="48,339,281.78"
          />
          <ItemListNavCard 
            name="ingreso actual"
            price="4,438,975.98"
          />
          <ItemListNavCard 
            name="egreso actual"
            price="418,135.98"
          />
          <ItemListNavCard 
            name="cxc"
            price="418,135.98"
          />
          <ItemListNavCard 
            name="cxp"
            price="418,135.98"
          />
        </View>
      </ScrollView>
      {
        balanceFetch?.isLoading
        ? <View style={{...stylesLoad.container, width: screenWidth, height: screenHeight}}>
            <Text style={{fontSize: 50, color: 'white'}}>...loading</Text>
          </View>
        : <View></View>
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
  }
});

const stylesLoad = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(80, 10, 50, 0.5)',
    zIndex: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  }
});