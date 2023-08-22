import { FC } from "react";
import { 
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert
} from "react-native";
import { colores } from '../utils/colorPallets';
import { useState, useRef, useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
}

export const Login: FC<LoginScreenProps> = ({navigation}):JSX.Element => {

  //Form useStates
  const [userInput, onChangeUser] = useState('');
  const [passwordInput, onChangePassword] = useState('');
  const [inputBorderColor, setInputBorderColor] = useState({
    user: true,
    password: true
  })

  const [isPasswordSecure, setisPasswordSecure] = useState<boolean>(true);
  const [payload, setPayload] = useState({
    user: '',
    password: ''
  })
  const { isAuth, isLoading, data } = useLogin(payload.user, payload.password);

  const changePayload = () => {
    setPayload({
      ...payload,
      user: userInput,
      password: passwordInput
    })
  }

  const handleBorderColor = (side:string) => {
    return data.side == side ? 'red':styles.input.borderColor;
  }

  const navigateToApp = () => {
    if(isAuth) {
      navigation.navigate('Home');
      // Alert.alert('Puede Irse a la otra pantalla');
    }
  }

  useEffect(() => {
    navigateToApp();
  }, [isAuth])
  

  return(
    <SafeAreaView>
      <StatusBar backgroundColor={'white'}/>
      <View style={styles.container}>
        <View style={styles.imageContainer}> 
          <Image 
            source={require('../images/GinthercorpLogoLow.png')}
            style={styles.image}
          />
        </View>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput 
          style={{...styles.input, borderColor: `${handleBorderColor('USER')}`}}
          placeholder=" Usuario"
          value={userInput}
          onChangeText={onChangeUser}
        />
        <View style={styles.containerPassword}>
          <TextInput 
            style={{...styles.input, flex: 1, borderColor: `${handleBorderColor('PASSWORD')}`}}
            placeholder=" Contrasena"
            secureTextEntry={isPasswordSecure}
            value={passwordInput}
            onChangeText={onChangePassword}
          />
          <View style={styles.containerEyePassword}>
            <TouchableOpacity 
              onPress={()=>setisPasswordSecure(!isPasswordSecure)}
            >
              {
                isPasswordSecure 
                ? <Image 
                    source={require('../images/eyeClose.png')}
                    style={styles.imageHidePassword}
                    />
                    : <Image 
                    source={require('../images/eyeOpen.png')}
                    style={styles.imageHidePassword}
                  />
              }
            </TouchableOpacity>
            
            {/* <Button 
              title="eye"
              color={isPasswordSecure ? colores.textSecondary : colores.primary}
              onPress={() => setisPasswordSecure(!isPasswordSecure)}
            /> */}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={changePayload}
          >
            <Text style={styles.loginText}>Login</Text>  
          </TouchableOpacity>
          
        </View>
        {
          data.side == 'USER' && <ErrorTag text={'Usuario No Encontrado'}/>
        }
        {
          data.side == 'PASSWORD' && <ErrorTag text={'Contraseña Incorrecta'}/> 
        }
        <View>
          {/* <Text style={{color: `${isLoading?'green': 'red'}`}}>{'Esta cargando ' + isLoading}</Text>
          <Text style={{color: `${isAuth?'green': 'red'}`}}>{'Este es el auth ' + isAuth}</Text>
          <Text>{'Este es la data ' + JSON.stringify(data)}</Text>
          <Text>{'Este es el payload ' + JSON.stringify(payload)}</Text>
          <Text>{'Estos Son Los Colores ' + JSON.stringify(inputBorderColor)}</Text> */}
        </View>
      </View>    
    </SafeAreaView>
  )
}
const ErrorTag = ({text}:any):JSX.Element => {
  return(
    <View style={stylesTag.container}>
      <Text style={stylesTag.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    color: colores.primary
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 50
  },
  title: {
    color: colores.textPrimary,
    textAlign: 'center',
    fontSize: 25,
    marginVertical: 20
  },
  input: {
    backgroundColor: colores.secondary,
    marginVertical: 15,
    marginHorizontal: 30,
    borderRadius: 10,
    borderColor: colores.darkBorder,
    borderWidth: 1,
    color: 'black'
  },
  buttonContainer: {
    marginHorizontal: 30
  },
  containerPassword: {
    flexDirection: "row",
    position: 'relative'
  },
  containerEyePassword: {
    position: "absolute",
    right: 40,
    bottom: 25
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200
  },
  imageHidePassword: {
    width: 30,
    height: 30,
  },
  loginButton: {
    backgroundColor: colores.primary, 
    marginVertical: 10,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center', 
  },
  loginText: {
    color: colores.textSecondary,
    fontSize: 20,
    fontWeight: 'bold'
  }
});

const stylesTag = StyleSheet.create({
  container: {
    paddingHorizontal: 30
  },
  text: {
    color: 'red',
    textAlign: 'center'
  }
});