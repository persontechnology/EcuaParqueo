import React, { useEffect, useState, useContext } from 'react'
import { View, Text, useToast, HStack, Spinner, Heading, Center, Box, VStack, FormControl, Input, Button, Select, CheckIcon, ScrollView } from 'native-base';
import { API_URL } from "@env";
import { AuthContext } from '../../../service/AuthContext';

export default function RevisionLecturaEntradaInvitado({ route, navigation }) {
    const { id } = route.params;
    const [cargando, setcargando] = useState(true);
    const toast = useToast();
    const { userToken } = useContext(AuthContext);
    const [lectura, setlectura] = useState();
    const [espacios, setespacios] = useState([]);
    const [placa, setplaca] = useState("SXA-2412");
    const [motivo, setmotivo] = useState("NA");
    const [espacio, setespacio] = useState("");
    const [finalizarRevision, setfinalizarRevision] = useState(false);
    const [finalizarEliminar, setfinalizarEliminar] = useState(false);

    const acceder = async () => {
        try {
            const res = await fetch(API_URL + "notificacion-lectura-invitado-revision", {
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

            if (data.lectura) {
                setlectura(data.lectura);
            }
            if (data.espacios) {
                setespacios(data.espacios);
            }

            if (data.errors) {
                Object.entries(data.errors).forEach(([key, value]) => {
                    toast.show({ 'description': value.toString() })
                });
            }

        } catch (error) {
            toast.show({ 'description': error.toString() })
        } finally {
            setcargando(false);
        }
    }

    const guardar = async () => {
        setfinalizarRevision(true)
        try {
            const res = await fetch(API_URL + "notificacion-lectura-invitado-finalizar-revision", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    id: lectura.id,
                    placa,
                    motivo,
                    espacio
                })
            });
            const data = await res.json();
            if (data === 'ok') {
                toast.show({ 'description': 'Revisión finalizado' })
                navigation.goBack();
            }
            if (data === 'no') {
                toast.show({ 'description': 'Ocurrio un error, vuelva intentar.' })
            }
            if (data.errors) {
                Object.entries(data.errors).forEach(([key, value]) => {
                    toast.show({ 'description': value.toString() })
                });
            }

        } catch (error) {
            toast.show({ 'description': error.toString() })
        } finally {
            setfinalizarRevision(false);
        }
    }

    const eliminar = async () => {
        setfinalizarEliminar(true)
        try {
            const res = await fetch(API_URL + "notificacion-lectura-invitado-finalizar-revision-eliminar", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    id: lectura.id
                })
            });
            const data = await res.json();
            if (data === 'ok') {
                toast.show({ 'description': 'Revisión finalizado' })
                navigation.goBack();
            }
            if (data === 'no') {
                toast.show({ 'description': 'Ocurrio un error, vuelva intentar.' })
            }
            if (data.errors) {
                Object.entries(data.errors).forEach(([key, value]) => {
                    toast.show({ 'description': value.toString() })
                });
            }

        } catch (error) {
            toast.show({ 'description': error.toString() })
        } finally {
            setfinalizarEliminar(false);
        }
    }

    useEffect(() => {
        acceder();
        setfinalizarRevision(false);
        setfinalizarEliminar(false);
    }, [])

    if (cargando) {
        return (
            <HStack key={"cargando-001"} space={2} justifyContent="center">
                <Spinner accessibilityLabel="Loading posts" />
                <Heading color="primary.500" fontSize="md">
                    Cargando...
                </Heading>
            </HStack>
        )
    } else {
        return (
            <ScrollView contentContainerStyle={{ flexGrow:1 }}>
            <Center flex={1}>
                <Box safeArea w="90%" py="1" shadow={1} >
                    <Heading size="lg" color="coolGray.800" _dark={{
                        color: "warmGray.50"
                    }} fontWeight="semibold">
                        Vehículo invitado
                    </Heading>
                    <Heading mt="1" color="coolGray.600" _dark={{
                        color: "warmGray.200"
                    }} fontWeight="medium" size="xs">
                        {'Complete datos de ' + lectura.tipo}
                    </Heading>
                    <VStack space={3} mt="5">
                        <FormControl isRequired>
                            <FormControl.Label>Placa:</FormControl.Label>
                            <Input value={placa} onChangeText={setplaca} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormControl.Label>Motivo:</FormControl.Label>
                            <Input value={motivo} onChangeText={setmotivo} />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Selecione espacio</FormControl.Label>
                            <Select selectedValue={espacio} accessibilityLabel="Selecione un espacio" placeholder="Selecione un espacio"
                                _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <CheckIcon size="5" key={"exc01icon"} />
                                }} mt={1} onValueChange={itemValue => setespacio(itemValue)}>
                                <Select.Item key={'espacio-0'} label={"Sin espacio"} _selectedItem value={""} />
                                {
                                    espacios.map((espacio) => {
                                        return (
                                            <Select.Item key={'espacio-' + espacio.id} label={espacio.numero + " - " + espacio.estado} value={espacio.id} />
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                        <Button colorScheme="emerald" isLoadingText={"Finalizando revisión"} isLoading={finalizarRevision} onPress={() => guardar()}>
                            Guardar
                        </Button>
                        <Button colorScheme="danger" isLoadingText={"Eliminando"} isLoading={finalizarEliminar} onPress={() => eliminar()}>
                            Falsa alarma
                        </Button>
                    </VStack>
                </Box>
            </Center>
            </ScrollView>
        )
    }
}
