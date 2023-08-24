import React from 'react';
import {  
  View,
  Text,
  StyleSheet, 
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { FC } from "react";
import { useScreenSize } from "../../hooks";
import { colores } from '../../utils/colorPallets';

type accountStateCardProps = {
  ruta: string,
  unit: string,
  price: string,
  function: () => void
}

const functioDefault = () => {
  Alert.alert('Push The Button')
}

export const AccountStateCard: FC<accountStateCardProps> = ({unit = 'UNIT', price = '0.00', ruta='', function:functioDefault}):JSX.Element => {
  const { screenWidth } = useScreenSize();

  const unitFormat = ():string => {
    return unit.toUpperCase();
  }

  const navigate = () => {

  }

  return (
    <TouchableOpacity
      
      onPress={functioDefault}
    >
      <View style={styles.cardContainer}>
        <View style={styles.titleContainer}>
          <Image source={require('../../images/cube-icon.png')}/>
          <Text style={styles.textWhite}>{unitFormat()}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>IMPORTE TOTAL</Text>
          <Text style={styles.infoPrice}>{price}</Text>
        </View>
        <Image source={require('../../images/LooperGroup.png')} 
          style={styles.imgBack}
          />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colores.primaryDark,
    width: 300,
    height: 150,
    borderRadius: 30,
    marginTop: 40,
    marginHorizontal: 10,
    position: 'relative'
  },
  titleContainer: {
    position: 'absolute',
    top: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 15,
  },
  infoContainer: {
    flex: 3,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },
  infoText: {
    fontSize: 10,
    color: colores.textSecondary
  },
  infoPrice: {
    fontSize: 30,
    color: colores.textSecondary,
    fontWeight: 'bold'
  },
  imgBack: {
    position: 'absolute',
    right: 0,
    width: 250,
    height: 150,
    opacity: 0.3
  },
  textWhite: {
    color: colores.textSecondary
  }
});
