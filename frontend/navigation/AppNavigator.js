import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Text, themeColor, useTheme } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";

import Home from "../screens/Home";
import About from "../screens/About";
import Profile from "../screens/Profile";

import LoginScreen from "../screens/LoginScreen";
import CampaignScreen from "../screens/CampaignScreen";
import { WalletContext } from "../context/wallet";
import { getValueFor } from "../utils/utils";
import { View } from "react-native";

const MainStack = createNativeStackNavigator();
const Main = () => {
  const {
    removeWallet,
    dehydrateWallet,
    state,
    state: { isUserLoggedIn },
  } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState(true);
  console.log("state", state);
  useEffect(() => {
    (async () => {
      const address = await getValueFor("address");
      const pk = await getValueFor("pk");
      address && pk && dehydrateWallet({ address, pk });
      setIsLoading(false);
    })();
  }, []);
  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isUserLoggedIn ? (
        <>
          <MainStack.Screen name="MainTabs" component={MainTabs} />
          <MainStack.Screen name="CampaignScreen" component={CampaignScreen} />
        </>
      ) : (
        <MainStack.Screen name="LoginScreen" component={LoginScreen} />
      )}
    </MainStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  const { isDarkmode } = useTheme();
  const {
    state,
    state: { isUserLoggedIn },
  } = useContext(WalletContext);

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Home" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"md-home"} />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Profile" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"person"} />
          ),
        }}
      />
      <Tabs.Screen
        name="About"
        component={About}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="About" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"ios-information-circle"} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default () => {
  return (
    <NavigationContainer>
      <Main />
    </NavigationContainer>
  );
};
