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
// import { createStackNavigator } from "@react-navigation/stack";
import { Login } from "./src/auth/login";
import { Home } from "./src/pages/guardado";
import { useScreenSize } from "./src/hooks";
import { authProvider } from "./src/context/authProvider";

function App(): JSX.Element {

  // const Stack = createStackNavigator();
  const { screenHeight } = useScreenSize();
  return (
    <NavigationContainer>
      {/* <authProvider> */}
        <View style={{backgroundColor: 'white', height: screenHeight}}>
          {/* <Login/> */}
          <Home/>
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
  }
});

export default App;
