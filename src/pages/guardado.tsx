import { 
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar
} from "react-native";
import { colores } from '../utils/colorPallets';
import { HeaderStateCard, AccountStateCard, ItemListNavCard } from "../components/cards";
import { useScreenSize } from "../hooks";
import { LineGraphic, PieGraphic, BarGraphic } from "../components/graphics";

export const Home = ():JSX.Element => {
  const { screenHeight } = useScreenSize();

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
            unit="Real Shiny"
            price="1,234,244.00"
            arrow={true}
          />
          <HeaderStateCard 
            unit="In driver"
            price="234,244.00"
          />
          <HeaderStateCard 
            unit="Secorp alarmas"
            price="934,244.00"
            arrow={false}
          />
          <HeaderStateCard 
            unit="caudillos"
            price="30,244.00"
            arrow={false}
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
      >
        <ScrollView 
          style={{...styles.scrollContainerCarousel}}
          horizontal
        >
          <AccountStateCard 
            unit="Secorp"
            price="4.348.975.98"
            />
          <AccountStateCard 
            unit="real shiny"
            price="300,245.98"
          />
          <AccountStateCard 
            unit="Driver Please"
            price="300,245.98"
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
        <PieGraphic />
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
  }
});
