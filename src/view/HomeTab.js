import React,{useContext,useEffect,useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo,Ionicons,MaterialCommunityIcons} from '@native-base/icons';
import { Icon } from 'native-base';
import { AuthContext } from '../service/AuthContext';
import HomeStackScreen from './Stack/HomeStackScreen';
import CombustibleStackScreen from './Stack/CombustibleStackScreen';


const Tab = createBottomTabNavigator();

export default function HomeTab() {
  const {userRolesPermisos,userToken}=useContext(AuthContext);

  return (
    
      <Tab.Navigator screenOptions={{ headerShown: false }}>

        <Tab.Screen name="TabHome" component={HomeStackScreen}  options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Icon as={Entypo} name="home" color={color} size={size} />
          ),
        }} />
        
        {
          userRolesPermisos.includes("Despachador") ?(
            <Tab.Screen name="TabCombustible" component={CombustibleStackScreen} options={{
              tabBarLabel: 'Combustible',
              tabBarIcon: ({ color, size }) => (
                <Icon as={MaterialCommunityIcons} name="fuel" color={color} size={size} />
              ),
            }} />
          ):<></>
        }
        


      </Tab.Navigator>
    
  );
}
