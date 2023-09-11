import {  
    View,
    Text,
    Button,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from "react-native";
import { colores } from "../utils/colorPallets";
import { FC, useEffect, useState } from "react";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useScreenSize } from "../hooks/useScreenSize";
import { ItemListNavCard, BankMovementCard} from "../components/cards";
import { BarGraphic } from "../components/graphics";
import { currentDay, firstOfMOnth } from "../utils";
import { envConfig } from "../../config";
import { useFetch } from "../hooks";

type BranchPageProps = StackScreenProps<RootStackParamList, 'Unit'>;

const today = currentDay();
const firstMonth = firstOfMOnth();

export const UnitBusinessPage: FC<BranchPageProps> = ({route, navigation}):JSX.Element => {
    const limit = 5;
    const { id, name, expense, income, utility } = route.params;
    const { screenHeight, screenWidth } = useScreenSize();

    const [indexList, setIndexList] = useState<number>(0);
    const [isFilterMovements, setisFilterMovements] = useState({
        incomes: false,
        expenses: false
    })

    //functions for change url data
    const setMovementUrlFilter = () => {
        if(isFilterMovements.incomes == true)
            return `&tipo=${1}`
        if(isFilterMovements.expenses == true)
            return `&tipo=${0}`
        return '';
    }

    const url = `${envConfig.urlBase}denken/calculosgraficas/detallado_movimientos?fechaI=${firstMonth}&fechaF=${today}&unidad=${id}&limit=${limit}&index=${indexList}${setMovementUrlFilter()}`;
    const balanceUrl = `${envConfig.urlBase}denken/calculosgraficas/balances?fechaI=${firstMonth}&fechaF=${today}&unidad=${id}`;
    
    const [movementList, setMovementList] = useState<any []>([]);
    const bankMovementsList = useFetch(url, 'get');
    const [existMovements, setExistMovements] = useState<boolean>(true);
    
    const balanceFetch = useFetch(balanceUrl, 'get');

    useEffect(() => {
        console.log(JSON.stringify(url));
        
        if(!bankMovementsList) 
            return;

        if(!bankMovementsList?.isLoading)
            updateMovementList();
    }, [bankMovementsList?.isLoading])
    
    useEffect( () => {
        resetListFilter();
    }, [isFilterMovements])

    useEffect(() => {
        if(balanceFetch?.isLoading)
            return
        if(!balanceFetch?.data) 
            return;
        console.log(balanceFetch.data);
        
    }, [balanceFetch?.isLoading])
    

    const navigateToHome = () => {
        navigation.navigate('Home');
    }

    const moneyFormat = (num: number) => {
        return num.toLocaleString('en').toString();
    }

    const handleViewMore = () => {
        setIndexList(indexList + limit);
    }

    const updateMovementList = () => {
        if(!bankMovementsList?.data) 
            return;

        const prov: any[] = bankMovementsList.data;
        if(prov.length == 0)
            return setExistMovements(false);
        
        if(prov.length < limit)
            setExistMovements(false)
        
        setMovementList(arr => [...arr,...prov]);        
    }

    const setFilters = (type: number) => {
        if(type == 1) {
            setisFilterMovements({incomes: false, expenses: !isFilterMovements.expenses});
        }
        else {
            setisFilterMovements({expenses: false, incomes: !isFilterMovements.incomes});
        }
    }

    const resetListFilter = () => {
        setMovementList([]);
        setExistMovements(true);
        setIndexList(0);
    }

    // HELPERS RENDER COMPONENTS
    const renderBankMovement = () => {
        if(movementList.length == 0) 
            return <View><Text style={{textAlign:'center'}}>No Hay Resutlados</Text></View>;
        
        return movementList.map( (data, index) =>  {
            const dataComp = {
                amount: data.monto,
                description: data.observaciones,
                date: data.fecha,
                account: data.cuenta,
                bank: data.banco,
                bankDescription: data.descripcion_cuenta,
                unit: name.toUpperCase(),
                branch: data.sucursal_descr,
            }
            return (
                <BankMovementCard  
                    bankData={dataComp}
                    isIncome={!(data.tipo_movimiento == 'Egreso')}
                    key={index}
                />)
            }
        );
    }

    const renderBarGraphic = () => {

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
            <ScrollView style={styles.scrollContainer}>
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
                <View>

                </View>

                {/* MOVEMENT LIST VIEWS */}
                <View>
                    <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row',marginBottom: 10}}>
                        <Text style={{color: colores.textPrimary, fontSize: 30}}>Movimientos</Text>
                        <View style={styles.movementTypesContainer}>
                            <TouchableOpacity
                                onPress={() => setFilters(0)}
                            >
                                {
                                    RenderStateArrow(isFilterMovements.incomes, 0)
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setFilters(1)}
                            >
                                {
                                    RenderStateArrow(isFilterMovements.expenses, 1)
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.bankMovementContainer}>
                        {
                            renderBankMovement()
                        }
                        <View style={styles.centerComp}>
                            {
                                bankMovementsList?.isLoading &&
                                <ActivityIndicator 
                                    size={'small'}
                                    color={colores.primary}
                                />
                            }
                        </View>
                    </View>
                    <View style={styles.viewMoreContainer}>
                        {
                            existMovements &&
                            <TouchableOpacity 
                                style={styles.viewMoreTouchable}
                                onPress={handleViewMore}
                            >
                                <Text style={styles.viewMoreText}>Ver Más</Text>
                                <Image
                                    source={require('../images/right-black.png')}
                                    style={styles.viewMoreImg}
                                />
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const RenderStateArrow = (state = true, type = 1) => {
    const up = {...stylesArrow.container, ...stylesArrow.up};
    const down = {...stylesArrow.container, ...stylesArrow.down};

    const upGray = {...stylesArrow.container, ...stylesArrow.upGray};
    const downGray = {...stylesArrow.container, ...stylesArrow.downGray};    ;

    const setStyles = () => {
        if(type == 1){
            if(state)
                return up;
            return upGray;
        }
        if(state)
            return down;
        return downGray;
    }

    return(
        <View style={setStyles()}>
            <Image
                source={require('../images/vector-icon.png')}
            />
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
    scrollContainer: {
        marginTop: 15,
        marginBottom: 100,
    },
    statsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
    },
    chartsContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewMoreContainer: {
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewMoreTouchable: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewMoreText: {
        color:'black',
        fontSize: 20
    },
    viewMoreImg: {
        width: 20,
        height: 20,
        transform: [{rotate: '90deg'}]
    },
    bankMovementContainer: {
        marginBottom: 10,
        overflow: 'hidden'
    },
    centerComp: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    movementTypesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        right: 20,
        width: 80,

    },
    movementTypesIcons: {
        width: 20,
        height: 30,
        marginHorizontal: 10,
        borderRadius: 10
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
    },
    upGray: {
      backgroundColor: colores.secondaryDark,
    },
    downGray: {
      backgroundColor: colores.secondaryDark,
      transform: [{rotate: '180deg'}]
    }
});