/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './src/screens/Home';
import NewsArticle from './src/screens/NewsArticle';
import Management from './src/screens/Management';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const App = () => {
  function HomeTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Management" component={Management} />
      </Tab.Navigator>
    );
  }
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="home"
            component={HomeTabs}
            options={{
              title: 'Home',
              headerStyle: {
                backgroundColor: '#264653',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                alignSelf: 'center',
              },
              headerLeft: () => <></>, // Just to make sure that the title will be centered
              headerRight: () => <></>,
            }}
          />
          <Stack.Screen
            name="NewsArticle"
            component={NewsArticle}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
