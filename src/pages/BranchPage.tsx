import {  
    View,
    Text,
    Button,
    StyleSheet
} from "react-native";
import { colores } from "../utils/colorPallets";
import { FC } from "react";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { useScreenSize } from "../hooks/useScreenSize";

type BranchPageProps = StackScreenProps<RootStackParamList, 'Branch'>;

export const BranchPage: FC<BranchPageProps> = ({route, navigation}):JSX.Element => {
    const { screenHeight, screenWidth } = useScreenSize();
    
    const navigateToHome = () => {
        navigation.navigate('Home');
    }

    return(
        <View style={{...styles.container, height: screenHeight, width: screenWidth}}>
            <Text>Este es el Id: {route.params.id}</Text>
            <Text>Este es la Unidad: {route.params.name}</Text>
            <Button 
                title="Home"
                onPress={navigateToHome}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'blue',
    }
});