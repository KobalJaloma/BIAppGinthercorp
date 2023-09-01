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
import { FC } from "react";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useScreenSize } from "../hooks/useScreenSize";
import { ItemListNavCard } from "../components/cards";
import { currentDay } from "../utils";

type BranchPageProps = StackScreenProps<RootStackParamList, 'Unit'>;

export const UnitBusinessPage: FC<BranchPageProps> = ({route, navigation}):JSX.Element => {
    const { screenHeight, screenWidth } = useScreenSize();
    
    const navigateToHome = () => {
        navigation.navigate('Home');
    }

    return(
        <View style={{...styles.container}}>
            <View style={{...styles.sectionTop, width: screenWidth}}>
                <Text style={styles.containerTopText}>{route.params.name.toUpperCase()}</Text>
                <Text style={styles.containerTopPrice}>$ {route.params.balanceMoney}</Text>
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
                        price="300,00"
                        isButton={false}
                    />
                    <ItemListNavCard 
                        name="Presupuesto Egresos"
                        price="300,00"
                        isButton={false}
                    />
                    <ItemListNavCard 
                        name="Utilidad"
                        price="300,00"
                        isButton={false}
                    />
                </View>
                <View style={styles.chartsContainer}>
                    <Text>{currentDay()}</Text>
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