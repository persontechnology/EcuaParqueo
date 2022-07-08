import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Inicio from '../Inicio';
import { API_NAME } from "@env";
import { Pressable } from 'react-native';
import Perfil from '../auth/Perfil';
import Detalle from '../Detalle';
import { Icon } from 'native-base';
import { FontAwesome } from '@native-base/icons';
import RegistrarRetorno from '../lecturas/normal/RegistrarRetorno';
import RevisionLecturaSalidaInvitado from '../lecturas/invitado/RevisionLecturaSalidaInvitado';
import RevisionLecturaEntradaInvitado from '../lecturas/invitado/RevisionLecturaEntradaInvitado';

const HomeStack = createNativeStackNavigator();

export default function HomeStackScreen({navigation}) {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen
                name="Home"
                component={Inicio}
                options={{
                    title: API_NAME,
                    headerRight: () => (
                        <Pressable onPress={() => navigation.navigate('Perfil')}>
                            <Icon as={FontAwesome} name="user-o" size={25} color="primary.700"></Icon>
                        </Pressable>
                    )
                }}

            />
            <HomeStack.Screen name="Perfil" component={Perfil} />
            <HomeStack.Screen name="RegistrarRetorno" options={{ title:'Revisión entrada normal' }} component={RegistrarRetorno} />
            <HomeStack.Screen name="RevisionLecturaSalidaInvitado" options={{ title:'Revisión salida invitado' }} component={RevisionLecturaSalidaInvitado} />
            <HomeStack.Screen name="RevisionLecturaEntradaInvitado" options={{ title:'Revisión entrada invitado' }} component={RevisionLecturaEntradaInvitado} />
            
            <HomeStack.Screen name="Details" component={Detalle} />


        </HomeStack.Navigator>
    );
}
