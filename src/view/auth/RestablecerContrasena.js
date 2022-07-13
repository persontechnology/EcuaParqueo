
import React,{useContext,useState} from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center,useToast,Icon } from "native-base";
import { API_NAME } from "@env"
import {AuthContext} from '../../service/AuthContext'
import {API_URL} from "@env";
import { MaterialIcons } from '@native-base/icons';
import * as Animatable from 'react-native-animatable';


export default function RestablecerContrasena({navigation}) {

    const [email, setemail] = React.useState('');
        const [cargando, setcargando] = React.useState(false);
        const toast = useToast();

        const  acceder= async()=>{
            setcargando(true);
            try {
                const res=await fetch(API_URL+"reset-password",{
                    method:'POST',
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        email
                    })
                });
                const data=await res.json();
                // console.log(data)
                if(data.errors){
                    Object.entries(data.errors).forEach(([key, value]) => {
                        toast.show({'description':value.toString()})
                    });
                }
                if(data.estado==='ok'){
                    toast.show({'description':data.mensaje})
                    setemail('') 
                }
    
            } catch (error) {
                toast.show({'description':error.toString()})
            }finally {
                setcargando(false);
            }
        }

    return (

        <Center w="100%" flex={1} px={3}>
            <Animatable.View animation="zoomInUp" easing="ease-out" >
                <Box safeArea p="2" py="8" w="90%" maxW="290">
                    <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }}>
                        Bienvenido
                    </Heading>
                    <Heading mt="1" _dark={{
                        color: "warmGray.200"
                    }} color="coolGray.600" fontWeight="medium" size="xs">
                        Ingresa tu correo electrónico para buscar tu cuenta.
                    </Heading>
                    
                    <VStack space={3} mt="5">
                        <FormControl isRequired>
                            <FormControl.Label>Email</FormControl.Label>
                            <Input  value={email} 
                            onChangeText={setemail} keyboardType="email-address" />
                        </FormControl>
                        
                        <Button mt="2" colorScheme="emerald" isLoading={cargando} onPress={acceder}>
                            Restablecer contraseña
                        </Button>
                        <HStack mt="6" justifyContent="center">
                            <Text fontSize="sm" color="coolGray.600" _dark={{
                                color: "warmGray.200"
                            }}>
                                {API_NAME + " © " + new Date().getFullYear() + "."}
                            </Text>
                        </HStack>
                    </VStack>
                </Box>
            </Animatable.View>
        </Center>

    );
};

