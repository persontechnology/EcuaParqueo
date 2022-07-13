import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    Text,
    Heading,
    VStack,
    FormControl,
    Input,
    Link,
    Button,
    HStack,
    Center,
    NativeBaseProvider,
    useToast,
    ScrollView,
} from "native-base";

import { AuthContext } from "../../service/AuthContext";
import { API_URL } from "@env";

export default function Inicio({ navigation }) {

    const [finalizarConsulta, setfinalizarConsulta] = useState(false);
    const [placa, setplaca] = useState('XBA-0018');
    const [codigo, setcodigo] = useState('SHGNPR');
    const { userRolesPermisos, userToken } = useContext(AuthContext);
    const toast = useToast();

    const guardar = async () => {

        setfinalizarConsulta(true)
        try {
            const res = await fetch(API_URL + "dc-consulta", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    placa,
                    codigo
                })
            });
            const data = await res.json();
            // console.log(data)
            if (data.codigo === codigo) {
                //   toast.show({'description':'Revisión finalizado'})

                navigation.navigate('DetalleCombustible', data);
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
            setfinalizarConsulta(false);
        }
    }


    return (
        <ScrollView contentContainerStyle={{ flexGrow:1 }}>
            <Center flex={1}>
                <Box safeArea p="2" py="8" w="90%" maxW="290">
                    <Heading
                        size="xs"
                        color="primary.700"
                        _dark={{
                            color: "warmGray.50",
                        }}
                    >
                        FORMULARIO AUTORIZACIÓN PARA EL DESPACHO DEL COMBUSTIBLE
                    </Heading>


                    <VStack space={3} mt="5">
                        <Box>Ingrese placa y código</Box>
                        <FormControl isRequired>
                            <FormControl.Label>PLACA</FormControl.Label>
                            <Input value={placa} onChangeText={setplaca}  />
                        </FormControl>
                        <FormControl isRequired>
                            <FormControl.Label>CÓDIGO</FormControl.Label>
                            <Input value={codigo} onChangeText={setcodigo} />
                        </FormControl>

                        <Button colorScheme="emerald" isLoadingText={"Finalizando revisión"} isLoading={finalizarConsulta} onPress={() => guardar()}>
                            Consultar
                        </Button>
                    </VStack>
                </Box>
            </Center>
        </ScrollView>
        
    );
}
