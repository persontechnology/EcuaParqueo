import React, { useState, useEffect } from 'react'
import { Icon, Text, Box, HStack, Spacer, Flex, Badge, useToast, View, Center, Heading, VStack, FormControl, Input, Link, Button, ScrollView } from "native-base";
import { API_URL } from '@env';
import { AuthContext } from '../../../service/AuthContext';
import Cargando from '../../Cargando';
import { Ionicons, MaterialCommunityIcons } from '@native-base/icons';


export default function RegistrarRetorno({ route, navigation }) {

    const { userToken } = React.useContext(AuthContext);
    const toast = useToast();
    const { id } = route.params;

    const [cargando, setcargando] = useState(true);
    const [enviandoRegistro, setenviandoRegistro] = useState(false);
    const [placaNumero, setplacaNumero] = useState('');
    const [fecha, setfecha] = useState('');
    const [kilometraje, setkilometraje] = useState('');
    const [combustible, setcombustible] = useState('');
    const [kilometrajeAnterior, setkilometrajeAnterior] = useState('');
    const [lectura, setlectura] = useState();
    const [ordenMovilizacion, setordenMovilizacion] = useState('');
    const [enviandoCancelar, setenviandoCancelar] = useState(false);

    const acceder = async () => {
        setcargando(true);
        try {
            const res = await fetch(API_URL + "lectura-normal-detalle", {
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
            // console.log(data)
            setfecha(data.fecha);
            setplacaNumero(data.placaNumero)
            setkilometrajeAnterior(data.kilometraje_anterior);
            setlectura(data);
            setordenMovilizacion(data.ordenMovilizacion)

        } catch (error) {
            toast.show({ 'description': error.toString() })
        } finally {
            setcargando(false);

        }
    }

    const registrar = async () => {

        setenviandoRegistro(true);
        try {
            const res = await fetch(API_URL + "lectura-normal-finalizar-entrada", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    id,
                    kilometraje,
                    combustible,
                    ordenMovilizacion
                })
            });
            const data = await res.json();
            console.log(data)
            if (data.estado === 'ok') {
                toast.show({ 'description': data.mensaje.toString() });
                navigation.goBack();

            }

            if (data.estado === 'no') {
                toast.show({ 'description': data.mensaje.toString() })
            }

            if (data.errors) {
                Object.entries(data.errors).forEach(([key, value]) => {
                    toast.show({ 'description': value.toString() })
                });
            }


        } catch (error) {
            // console.log(error)
            toast.show({ 'description': error.toString() })
        } finally {
            setenviandoRegistro(false);
        }
    }


    const cancelar = async () => {

        setenviandoCancelar(true);
        try {

            const res = await fetch(API_URL + "lectura-normal-cancelar-entrada", {
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
            console.log(data)
            if (data.estado === 'ok') {
                toast.show({ 'description': data.mensaje.toString() });
                navigation.goBack();

            }

            if (data.estado === 'no') {
                toast.show({ 'description': data.mensaje.toString() })
            }

            if (data.errors) {
                Object.entries(data.errors).forEach(([key, value]) => {
                    toast.show({ 'description': value.toString() })
                });
            }


        } catch (error) {
            // console.log(error)
            toast.show({ 'description': error.toString() })
        } finally {
            setenviandoCancelar(false);
        }
    }


    useEffect(() => {
        acceder();
    }, [])

    return cargando ? (
        <Cargando />
    ) : (
        <ScrollView>
            <Center flex={1}>
                <Box maxW="96" mx={3} my={1} borderWidth="1" borderColor="coolGray.300" shadow="3" bg="coolGray.100" p="5" rounded="8">
                    <Badge>{"Lectura: " + lectura.estado}</Badge>
                    <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }}>
                        {'N° movil: ' + lectura.movil}

                    </Heading>
                    <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }}>

                        {'Placa: ' + placaNumero}
                    </Heading>

                    <Heading mt="1" _dark={{
                        color: "warmGray.200"
                    }} color="coolGray.600" fontWeight="medium" size="xs">
                        {fecha}
                    </Heading>

                    <VStack space={3} mt="5">
                        <FormControl isRequired>
                            <FormControl.Label>{'Ingrese kilometraje mayor a: ' + kilometrajeAnterior} </FormControl.Label>
                            <Input value={kilometraje.toString()} onChangeText={setkilometraje} keyboardType={"numeric"} InputLeftElement={<Icon as={<Ionicons name="speedometer" />} size={7} ml="2" color="muted.400" />} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormControl.Label>Ingrese % de combustible entre: 1 a 100</FormControl.Label>
                            <Input value={combustible.toString()} onChangeText={setcombustible} keyboardType={"numeric"} InputLeftElement={<Icon as={<MaterialCommunityIcons name="speedometer" />} size={7} ml="2" color="muted.400" />} />

                        </FormControl>

                        <FormControl>
                            <FormControl.Label>N° orden movilización opcional</FormControl.Label>
                            <Input value={ordenMovilizacion.toString()} onChangeText={setordenMovilizacion} InputLeftElement={<Icon as={<MaterialCommunityIcons name="speedometer" />} size={7} ml="2" color="muted.400" />} />

                        </FormControl>


                        <Button mt="2" isLoading={enviandoRegistro} isLoadingText="Procesando..." colorScheme={"info"} onPress={registrar}>
                            {enviandoRegistro ? 'Procesando' : 'Registrar'}
                        </Button>
                        <Button mt="2" isLoading={enviandoCancelar} isLoadingText="Cancelando" colorScheme="primary" onPress={cancelar}>
                            Cancelar
                        </Button>
                    </VStack>
                </Box>
            </Center>
        </ScrollView>

    )
}
