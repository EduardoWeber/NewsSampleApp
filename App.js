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
import Icon from 'react-native-vector-icons/Entypo';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './src/screens/Home';
import NewsArticle from './src/screens/NewsArticle';
import Management from './src/screens/Management';
import Edit from './src/screens/Edit';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const App = () => {
  function HomeTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Home') {
              return <Icon name="home" size={size} color={color} />;
            }
            if (route.name === 'Gerenciamento') {
              return (
                <IconMCI name="file-document-edit" size={size} color={color} />
              );
            }
            return <></>;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'white',
          inactiveTintColor: 'gray',
          style: {
            backgroundColor: '#264653',
            borderTopColor: 'transparent',
          },
        }}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Gerenciamento" component={Management} />
      </Tab.Navigator>
    );
  }
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#264653',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              alignSelf: 'center',
            },
            // headerLeft: () => <></>, // Just to make sure that the title will be centered
            headerRight: () => <></>,
          }}
        >
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
          <Stack.Screen
            name="Edit"
            component={Edit}
            options={{ title: 'Editando' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
