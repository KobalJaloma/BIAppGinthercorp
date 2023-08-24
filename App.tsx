import { FC } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button, 
  Alert
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { Login } from "./src/auth/login";
import { Home } from "./src/pages/guardado";
import { useScreenSize } from "./src/hooks";
import { authProvider } from "./src/context/authProvider";
import { BranchPage } from "./src/pages/BranchPage";


export type RootStackParamList = {
  Login: undefined,
  Home: undefined,
  Branch: Branches,
}

interface Branches {
  id: string;
  name: string;
}


const Stack = createStackNavigator<RootStackParamList>();

const App: FC = () => {
  
  const { screenHeight } = useScreenSize();
  
  return (
    <NavigationContainer   
  
    >
      <View style={{backgroundColor: 'white', height: screenHeight}}>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen 
            name='Login'
            component={Login}
            options={{title: 'Login', cardStyle: {...styles.white}}}
          />
          <Stack.Screen 
            name='Home'
            component={Home}
            options={{title: 'Home', cardStyle: {...styles.white}}}
          />
          <Stack.Screen 
            name='Branch'
            component={BranchPage}
            options={{title: 'Branch', cardStyle: {...styles.white}}}
          />
        </Stack.Navigator>
          {/* <authProvider> */}
          {/* <Login/> */}
          {/* <Home/> */}
        </View>
      {/* </authProvider> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  red: {
    backgroundColor: 'red'
  },
  green: {
    backgroundColor: 'green'
  },
  white: {
    backgroundColor: 'white'
  }
});

export default App;
