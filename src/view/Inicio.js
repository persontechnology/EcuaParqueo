import { Box, Button, ScrollView,Center } from 'native-base'
import React,{useContext, useEffect} from 'react'
import { AuthContext } from '../service/AuthContext'
import AlertaEspecial from './lecturas/especial/AlertaEspecial';
import AlertaInvitado from './lecturas/invitado/AlertaInvitado';
import AlertaNormal from './lecturas/normal/AlertaNormal';

export default function Inicio({navigation}) {
  const {userRolesPermisos,userToken}=useContext(AuthContext);
  return (
    <ScrollView contentContainerStyle={{ flexGrow:1 }}>
      <Center flex={1}>
        {
          userRolesPermisos.includes("Guardia")?(
            <>
              <AlertaNormal navigation={navigation}/>
              <AlertaInvitado navigation={navigation}/>
              <AlertaEspecial navigation={navigation}/>
            </>
          ):<></>
        }
      </Center>
    </ScrollView>

  )
}
