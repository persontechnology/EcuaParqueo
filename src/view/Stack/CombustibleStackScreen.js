import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Inicio from '../combustible/Inicio';
import Detalle from '../combustible/Detalle';

const CombustibleStack = createNativeStackNavigator();

export default function CombustibleStackScreen() {
    return (
        <CombustibleStack.Navigator>
            <CombustibleStack.Screen name="InicioCombustible" component={Inicio} options={{ title:'Despacho de combustible' }}/>
            <CombustibleStack.Screen name="DetalleCombustible" component={Detalle} options={{ title:'Despacho de combustible' }}/>
            
        </CombustibleStack.Navigator>
    )
}
