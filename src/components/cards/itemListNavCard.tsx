
import {  
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { useScreenSize } from "../../hooks";
import { colores } from "../../utils/colorPallets";
import { LinearGradient } from "react-native-linear-gradient";

const bFunction=()=>{};

export const ItemListNavCard = ({name = '', price = '', isButton=true, isMoney=true}):JSX.Element => {
  const { screenWidth } = useScreenSize();

  const test = () => {
    Alert.alert(`se presiono el boton de ${name}`);
  }

  const moneyFormat = ():string => {
    return parseFloat(price).toLocaleString('en');
  }

  return (
    <LinearGradient 
      start={{x : 0,y : 0}}
      end={{x : 1,y : 0}}
      colors={[colores.primaryDark, colores.primary]}
      style={{...styles.cardContainer, width: screenWidth-20}}
    >
      <View style={styles.infoContainer}>
        <View style={styles.imgIconContainer}>
          <Image 
            source={require('../../images/wallet.png')}
            style={styles.imgIcon}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{name ? name.toUpperCase(): 'NOT FOUND'}</Text>
          <Text style={styles.price}>{isMoney && '$'} {price ? moneyFormat() : 'NOT FOUND'}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={{...styles.navContainer, opacity: isButton?1:0}}
        onPress={test}
        disabled={!isButton}
      >
        <Image 
          source={require('../../images/right.png')}
          style={styles.imgNav}  
        />
      </TouchableOpacity>
    </LinearGradient>
  )
}


const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colores.primaryDark,
    borderRadius: 20,
    marginVertical: 10,
    height: 80,
    flexDirection: 'row'
  },
  infoContainer: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textContainer: {
    flex: 4,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20
  },
  navContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingEnd: 10,
    backgroundColor: 'transparent'
  },
  imgIcon: {
    width: 40,
    height: 50
  },
  imgIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  imgNav: {
    alignSelf: 'center'
  },
  text: {
    fontSize: 15,
    color: colores.textSecondary,
  },
  price: {
    fontSize: 20,
    color: colores.textSecondary,
    fontWeight: '600'
  }
});