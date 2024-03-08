import Home from "./components/Home"
import Gameboard from "./components/Gameboard"
import Scoreboard from "./components/Scoreboard"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useFonts } from "expo-font"
import { Text } from 'react-native'

const Tab = createBottomTabNavigator()

export default function App() {
  const [fontsLoaded] = useFonts({
    "MeowScript-Regular": require("./assets/fonts/MeowScript-Regular.ttf"),
    "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf")
  });
  if (!fontsLoaded) {
    return <Text>Loading...</Text>
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
      sceneContainerStyle={{backgroundColor: "#2E4057"}}
        screenOptions={({ route }) => ({
          tabBarStyle: {backgroundColor: "#2E4057",
                        borderTopColor: "#66A182"},
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? 'information'
                : 'information-outline';
            } else if (route.name === 'Gameboard') {
              iconName = focused 
                ? 'dice-multiple' 
                : 'dice-multiple-outline';
            }
            else if (route.name === 'Scoreboard') {
              iconName = focused 
                ? 'view-list' 
                : 'view-list-outline';
            }

            // You can return any component that you like here!
            return <MaterialCommunityIcons 
              name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3D634F',
          tabBarInactiveTintColor: '#66A182',
        })}
      >
        <Tab.Screen name="Home" component={Home}
          options={{tabBarStyle: {display: "none"}}}/>
        <Tab.Screen name="Gameboard" component={Gameboard} />
        <Tab.Screen name="Scoreboard" component={Scoreboard} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}