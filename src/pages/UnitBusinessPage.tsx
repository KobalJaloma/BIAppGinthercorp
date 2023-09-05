import {  
    View,
    Text,
    Button,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { colores } from "../utils/colorPallets";
import { FC, useEffect } from "react";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useScreenSize } from "../hooks/useScreenSize";
import { ItemListNavCard, BankMovementCard} from "../components/cards";
import { currentDay } from "../utils";
import { envConfig } from "../../config";
import { useFetch } from "../hooks";

type BranchPageProps = StackScreenProps<RootStackParamList, 'Unit'>;

export const UnitBusinessPage: FC<BranchPageProps> = ({route, navigation}):JSX.Element => {
    const url = `${envConfig.urlBase}denken/calculosgraficas/detallado_movimientos?fechaI=2023-09-01&fechaF=2023-09-04`;
    
    const { screenHeight, screenWidth } = useScreenSize();
    const { id, name, expense, income, utility } = route.params;
    const bankMovementsList = useFetch(url, 'get');
    
    useEffect(() => {
        console.log(JSON.stringify(url));
        
        if(!bankMovementsList) 
            return;
        console.log(JSON.stringify(bankMovementsList.data));
    }, [bankMovementsList?.isLoading])
    
    const navigateToHome = () => {
        navigation.navigate('Home');
    }

    const moneyFormat = (num: number) => {
        return num.toLocaleString('en').toString();
    }

    return(
        <View style={{...styles.container}}>
            <View style={{...styles.sectionTop, width: screenWidth}}>
                <Text style={styles.containerTopText}>{name.toUpperCase()}</Text>
                <Text style={styles.containerTopPrice}>$ {moneyFormat(utility)}</Text>
                {/* BACK BUTTON */}
                <TouchableOpacity 
                    style={styles.buttonBack}
                    onPress={navigateToHome}
                >
                    <Image
                        source={require('../images/right.png')}
                        style={styles.buttonBackImg}
                    />
                </TouchableOpacity>
                {/* NOTCH SPCAE ON TOP */}
                <View style={styles.dockBottom}>
                    <View style={styles.dockTextContainer}>
                        <Text style={styles.dockText}>UNIDAD</Text>
                    </View>
                </View>
            </View>
            <ScrollView style={{marginTop: 15}}>
                <View style={styles.statsContainer}>
                    <ItemListNavCard 
                        name="Presupuesto Ingreos"
                        price={income.toString()}
                        isButton={false}
                    />
                    <ItemListNavCard 
                        name="Presupuesto Egresos"
                        price={expense.toString()}
                        isButton={false}
                    />
                    <ItemListNavCard 
                        name="Utilidad"
                        price={utility.toString()}
                        isButton={false}
                    />
                </View>
                <View style={styles.chartsContainer}>
                    <Text>{currentDay() + ' ' + id}</Text>
                </View>
                <View>
                    <BankMovementCard 
                        amount={200000}
                        description="Se hizo una transferencia bancaria a la cuenta 1023"
                        />
                    <BankMovementCard 
                        amount={3000}
                        description="Pago de Factura"
                        isIncome={false}
                    />
                    <BankMovementCard 
                        amount={80000}
                        description="Pago de credito"
                    />
                </View>
            </ScrollView>
        </View>
    )
}


const topNotchSize = 30;
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignContent: 'center',
    },
    sectionTop: {
        height: 200,
        backgroundColor: colores.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    containerTop: {

    },
    containerTopText: {
        fontSize: 30,
        color: colores.textSecondary
    },
    containerTopPrice: {
        fontSize: 35,
        fontWeight: 'bold',
        color: colores.textSecondary,
        marginBottom: topNotchSize
    },
    buttonBack: {
        backgroundColor: colores.primaryDark,
        position: 'absolute',
        padding: 5,
        top: 20,
        left: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    buttonBackImg: {
        width: 25,
        height: 25,
        transform: [{rotate: '180deg'}]
    },
    dockBottom: {
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 2,
        paddingVertical: topNotchSize,
        margin: 0,
        bottom:-30,
        right: 0,
        left: 0,
        borderTopEndRadius: 30,
        borderTopLeftRadius: 30
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
      statsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
      },
      chartsContainer: {
        justifyContent: 'center',
        alignItems: 'center'
      }
});