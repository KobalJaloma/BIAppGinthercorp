import {  
    View,
    Text,
    StyleSheet,
    TouchableOpacity, 
    Image,
    Alert,
    Modal,
    ScrollView
} from "react-native";
import { useEffect, useState, FC } from "react";
import { useScreenSize } from "../../hooks";
import { colores } from "../../utils";

type BankMovementProps = {
    id?: number,
    bankData?: BankData,
    isIncome?: boolean,
    isPressable?: boolean,
}

type BankData = {
    amount: number,
    description?: string,
    date?: string,
    account?: string,
    bank?: string,
    bankDescription?: string,
    unit?: string,
    branch?: string,

}

export const BankMovementCard:FC<BankMovementProps> = ({
    id, 
    bankData,
    isIncome = true,
    isPressable = true
}):JSX.Element => {
    
    const { screenWidth, screenHeight } = useScreenSize();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);


    const moneyFormat = (amount: number):string => {
        return amount.toLocaleString('en').toString();
    }

    const testClick = () => {
        // Alert.alert("se Presiono el boton con " + amount);
        setIsModalVisible(true);
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
            <Text style={{...styles.infoContainer, textAlignVertical: 'center', flex: 1}}
                numberOfLines={1}
                ellipsizeMode="tail"
            > 
                $ {!isIncome && '- '}{moneyFormat(bankData?.amount??0)}
            </Text>
        </View>
        <View style={{flex: 6}}>
            <Text 
                style={{...styles.infoContainer, textAlignVertical: 'center', flex: 1}}
                numberOfLines={2}
                ellipsizeMode="tail"
            > 
                {bankData?.description?.trim()}
            </Text>
        </View>
        <View style={styles.arrowContainer}>
            {
               RenderStateArrow(isIncome)
            }
        </View>

        <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsModalVisible(true)}
        >
            <View style={{...stylesModal.centerContainer, width: screenWidth, height: screenHeight}}>
                <View
                    style={{...stylesModal.modalContainer, width: screenWidth-50, height: screenHeight-300}}
                >
                    <View style={stylesModal.container}>
                        {/* EXIT BUTTON */}
                        <TouchableOpacity
                            onPress={()=>setIsModalVisible(false)}
                            style={stylesModal.exitButton}
                        >
                           <Image 
                                source={require('../../images/right.png')}
                                style={stylesModal.exitIconImg}
                           />
                        </TouchableOpacity>
                        <View style={stylesModal.modalHeader}>
                            <Text style={{fontSize: 20, color: colores.primaryDark}}>Movimiento Bancario</Text>
                        </View>
                        <View style={{...stylesModal.infoContainer}}>
                            <View style={stylesModal.infoContainerRow}>
                                <View style={{marginRight: 10,flex: 2}}>
                                    <Text style={{...stylesModal.textHeader, backgroundColor: isIncome ? colores.success : colores.fail}}>Cantidad</Text>
                                    <Text style={stylesModal.textBlack}>$ {!isIncome && '- '}{moneyFormat(bankData?.amount??0)}</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={stylesModal.textHeader}>Fecha</Text>
                                    <Text style={stylesModal.textBlack}>{bankData?.date}</Text>
                                </View>
                            </View>
                            <View style={stylesModal.infoContainerRow}>
                                <View style={{flex: 1}}>
                                    <Text style={stylesModal.textHeader}>Descripcion</Text>
                                    <Text style={stylesModal.textBlack}>{bankData?.description?.trim()}</Text>
                                </View>
                            </View>
                            <View style={stylesModal.infoContainerRow}>
                                <View style={{marginRight: 10,flex: 1}}>
                                    <Text style={stylesModal.textHeader}>Unidad</Text>
                                    <Text style={stylesModal.textBlack}>{bankData?.unit ?? 'Desconocido'}</Text>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={stylesModal.textHeader}>Sucursal</Text>
                                    <Text style={stylesModal.textBlack} numberOfLines={1}>{bankData?.branch ?? 'Desconocido'}</Text>
                                </View>
                            </View>
                            <View style={stylesModal.infoContainerRow}>
                                <View style={{marginRight: 10, flex: 1}}>
                                    <Text style={stylesModal.textHeader}>Cuenta</Text>
                                    <Text style={stylesModal.textBlack}>{bankData?.account ?? 'Desconocido'}</Text>
                                </View>
                                <View style={{flex: 2}}>
                                    <Text style={stylesModal.textHeader}>Banco</Text>
                                    <Text style={stylesModal.textBlack}>{bankData?.bank ?? 'Desconocido'}</Text>
                                </View>

                            </View>
                            <View style={stylesModal.infoContainerRow}>
                                <View style={{flex: 1}}>
                                    <Text style={stylesModal.textHeader}>Descripcion De Cuenta</Text>
                                    <Text style={stylesModal.textBlack}>{bankData?.bankDescription ?? 'Desconocido'}</Text>
                                </View>
                            </View>
                            {/* <Text style={stylesModal.textBlack}>Cuenta: 2467</Text> */}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
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

const stylesModal = StyleSheet.create({
    centerContainer: {
      justifyContent: 'center',
      alignItems: 'center'  
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 20
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: 300,

    },
    modalHeader: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50
        // backgroundColor: colores.primary
    },
    exitButton: {
        top: 10,
        left: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: colores.primaryDark  ,
        position: 'absolute',
        borderRadius: 20
    },
    exitIconImg: {
        width: 10,
        height: 10,
        transform: [{rotate: '180deg'}]
    },
    textHeader: {
        backgroundColor: colores.primary,
        color: colores.textSecondary, 
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        paddingHorizontal: 5,
        fontWeight: 'bold'
    },
    infoContainerRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    textBlack: {
        color: 'black',
        fontSize: 15,
        marginBottom: 15,
    },
    textPrimary: {
        color: colores.primary
    }
});