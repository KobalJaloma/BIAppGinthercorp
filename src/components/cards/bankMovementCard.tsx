import {  
    View,
    Text,
    StyleSheet,
    TouchableOpacity, 
    Image,
    Alert
} from "react-native";
import { useEffect, useState, FC } from "react";
import { useScreenSize } from "../../hooks";
import { colores } from "../../utils";

type BankMovementProps = {
    id?: number,
    amount: number,
    description?: string,
    isIncome?: boolean,
    isPressable?: boolean,
}

export const BankMovementCard:FC<BankMovementProps> = ({
    id, 
    amount, 
    description, 
    isIncome = true,
    isPressable = false
}):JSX.Element => {
    
    const { screenWidth } = useScreenSize();

    const moneyFormat = (amount: number):string => {
        return amount.toLocaleString('en').toString();
    }

    const testClick = () => {
        Alert.alert("se Presiono el boton con " + amount)
    }

    return (
    <TouchableOpacity 
        style={{...styles.container, marginVertical: 5}}
        activeOpacity={1}
        disabled={!isPressable}
        onPress={testClick}
    >   
        <View style={{flexDirection: 'column', flex: 2}}>
            {/* <Text style={{...styles.infoContainer, ...styles.textCenter, flex: 1 }}>Unidad: 1</Text> */}
            <Text style={{...styles.infoContainer, textAlignVertical: 'center', flex: 1}}> $ {!isIncome && '- '}{moneyFormat(amount)}</Text>
        </View>
        <View style={{flex: 6}}>
            <Text 
                style={{...styles.infoContainer, textAlignVertical: 'center', flex: 1}}
                numberOfLines={2}
                ellipsizeMode="tail"
            > 
                {description}
            </Text>
        </View>
        <View style={styles.arrowContainer}>
            {
               RenderStateArrow(isIncome)
            }
        </View>
    </TouchableOpacity>
    )
}

const RenderStateArrow = (state = true) => {
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
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 15,
        height: 50,
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: colores.primaryDark,
    },
    infoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        color: colores.secondary
    },
    textGreen: {
        color: colores.success
    },
    textReed: {
        color: colores.fail
    },
    textCenter: {
        textAlign: 'center', 
        textAlignVertical: 'center'
    },
    arrowContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const stylesArrow = StyleSheet.create({
    container: {
      width: 20,
      height: 25,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5
    },
    up: {
      backgroundColor: colores.success
    },
    down: {
      backgroundColor: colores.fail,
      transform: [{rotate: '180deg'}]
    }
  });