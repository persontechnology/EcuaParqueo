import React, { useState, useEffect, useContext } from 'react';
import { Pressable, Text, Box, HStack, Spacer, Badge, Flex, View, Spinner, Heading } from "native-base";

import { API_URL } from '@env';
import { AuthContext } from '../../../service/AuthContext';


export default function AlertaEspecial({ navigation }) {
    const { userToken } = useContext(AuthContext);
    const [lecturas, setlecturas] = useState([]);
    const [finalizarCarga, setfinalizarCarga] = useState(false);
    const [idLectura, setidLectura] = useState();
    const acceder = async () => {
        try {
            const res = await fetch(API_URL + "notificacion-lectura-especial", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({

                })
            });
            const data = await res.json();
            // console.log(data)
            setlecturas(data);
            setfinalizarCarga(true)
        } catch (error) {
        } finally {
        }
    }



    const cerrarNotificacion = async (id) => {
        setidLectura(id);
        try {
            setlecturas(lecturas.filter(item => item.id !== id))
            const res = await fetch(API_URL + "notificacion-lectura-especial-finalizar", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    id
                })
            });
            const data = await res.json();

        } catch (error) {

        } finally {
            setidLectura();
        }
    }


    useEffect(() => {

        acceder()
        const interval = setInterval(() => {
            acceder()
        }, 3000)

        return () => clearInterval(interval)
    }, [])


    if (finalizarCarga) {

        return (
            <View>
                {
                    lecturas.map(function (lectura, i) {
                        return (
                            <Box alignItems="center" my={1} mx={1} key={'detalle-le-' + lectura.id}>
                                <Pressable onPress={() => cerrarNotificacion(lectura.id)}
                                >
                                    {
                                        ({
                                            isPressed
                                        }) => {
                                            return <Box maxW="100%" borderWidth="1" borderColor={lectura.tipo === 'Entrada' ? 'info.400' : 'secondary.400'} shadow="5" bg={lectura.tipo === 'Entrada' ? 'info.100' : 'secondary.100'} p="1" rounded="5"
                                                style={{
                                                    transform: [{
                                                        scale: isPressed ? 0.96 : 1
                                                    }]
                                                }}
                                            >
                                                <HStack alignItems="center">
                                                    <Badge colorScheme={lectura.tipo === 'Entrada' ? 'info' : 'secondary'} _text={{
                                                        color: "white"
                                                    }} variant="solid" rounded="4">
                                                        Especial
                                                    </Badge>
                                                    <Spacer />
                                                    <Text fontSize={10} color="coolGray.800">
                                                        {lectura.fecha}
                                                    </Text>
                                                </HStack>
                                                <Text color="coolGray.800" fontWeight="medium" fontSize="xl">
                                                    {lectura.titulo}
                                                </Text>
                                                <Text fontSize="sm" color="coolGray.700">
                                                    {lectura.mensaje}
                                                </Text>
                                                <Flex>
                                                    <Text fontSize={12} fontWeight="medium" color={lectura.tipo === 'Entrada' ? 'info.600' : 'secondary.600'}>
                                                        {lectura.id == idLectura ? 'Finalizando' : 'Precione para finalizar'}
                                                    </Text>
                                                </Flex>
                                            </Box>
                                        }
                                    }
                                </Pressable>
                            </Box>
                        )
                    })
                }
            </View>
        )

    } else {
        return <View><Text>CARGANDO</Text></View>
    }

}
