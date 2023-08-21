import React from 'react';
import {  
  View,
  Text,
  Image,
  StyleSheet
} from "react-native";
import { colores } from "../../utils/colorPallets";
import { useScreenSize } from "../../hooks";

export const HeaderStateCard = ({unit = 'UNIT', price = '0.00', arrow=true}):JSX.Element => {
  
  const { screenHeight, screenWidth } = useScreenSize();

  const priceFormat = (price:string):string => {
    return `$ ${price}`;
  }
  const unitFormat = (unit:string):string => {
    return unit.toUpperCase();
  }

  return (
    <View>
      <View style={{...styles.topContainer, width: screenWidth}}>
        <Text style={styles.textTopName}>{unitFormat(unit)}</Text>
        <View style={styles.priceContainer}>
            <View style={styles.icon}>
              <ArrowIcon 
                state={arrow}
              />
            </View>
          <Text style={styles.textTopPrice}>{priceFormat(price)}</Text>
        </View>
      </View>
    </View>
  )
}

const ArrowIcon = ({state = false}):JSX.Element => {
  const up = {...stylesArrow.container, ...stylesArrow.up};
  const down = {...stylesArrow.container, ...stylesArrow.down};

  return(
    <View style={state ? up : down}>
      <Image
        source={require('../../images/vector-icon.png')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  topContainer : {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
    margin: 1
  },
  textTopName: {
    color: colores.textSecondary,
    fontSize: 25,
    textAlign: 'center'
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: 'relative'
  },
  textTopPrice: {
    color: colores.textSecondary,
    fontSize: 30,
    fontWeight: 'bold',
  },
  icon:{
    position: 'absolute',
    left: -35
  }
});

const stylesArrow = StyleSheet.create({
  container: {
    width: 25,
    height: 30,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15
  },
  up: {
    backgroundColor: colores.success
  },
  down: {
    backgroundColor: colores.fail,
    transform: [{rotate: '180deg'}]
  }
});