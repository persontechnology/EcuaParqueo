import React, { useContext } from 'react'
import { Box, Heading, AspectRatio, Image, Text, Center, HStack, Stack, Button, Icon, VStack, FormControl, Input, useToast, ScrollView } from "native-base";
import { AuthContext } from '../../service/AuthContext';
import { Entypo, MaterialIcons } from '@native-base/icons';
import {API_URL} from "@env";
export default function Perfil({ navigation }) {
    const { userName, userEmail, userRolesPermisos, signOut,userId, userToken } = useContext(AuthContext);

    const toast = useToast();
    const [pwdUno, setpwdUno] = React.useState(false);
    const [pwdDos, setpwdDos] = React.useState(false);
    const [pwdTres, setpwdTres] = React.useState(false);
    const [pwdActual, setpwdActual] = React.useState('');
    const [pwdNueva, setpwdNueva] = React.useState('');
    const [pwdRepita, setpwdRepita] = React.useState('');
    const [cargando, setcargando] = React.useState(false);

    const acceder = async () => {
        setcargando(true);
        try {
            const res = await fetch(API_URL + "actualizar-contrasena", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                },
                body: JSON.stringify({
                    userId,
                    pwdActual,
                    pwdNueva,
                    pwdRepita
                })
            });
            const data = await res.json();
            if (data.errors) {
                Object.entries(data.errors).forEach(([key, value]) => {
                    toast.show({ 'description': value.toString() })
                });
            }
            if (data.message === 'ok') {
                toast.show({ 'description': 'Contreseña actualizada' })
                setpwdActual('');
                setpwdNueva('');
                setpwdRepita('');
            }

        } catch (error) {
            toast.show({ 'description': error.toString() })
        } finally {
            setcargando(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow:1 }}>
        <Center flex={1}>
            
                <Box  _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700"
                }} _web={{
                    shadow: 2,
                    borderWidth: 0
                }} _light={{
                    backgroundColor: "gray.50"
                }}>
                    <Box>
                        <Center bg="primary.500" _dark={{
                            bg: "violet.400"
                        }} _text={{
                            color: "warmGray.50",
                            fontWeight: "700",
                            fontSize: "xs"
                        }} >
                            {userEmail}
                        </Center>
                    </Box>
                    <Stack p="5" space={1}>
                        <Stack space={1}>
                            <Heading size="md" ml="-1">
                                {userName}
                            </Heading>
                            <Text fontSize="xs" _light={{
                                color: "violet.500"
                            }} _dark={{
                                color: "violet.400"
                            }} fontWeight="500" ml="-0.5" mt="-1">
                                Roles: {userRolesPermisos}
                            </Text>
                        </Stack>
                        <Button variant={"solid"} onPress={() => signOut()} colorScheme="danger" leftIcon={
                            <Icon as={Entypo} name="log-out" size="sm" />
                        }>
                            Cerrar sessión
                        </Button>
                    </Stack>
                    <Box mx={2}>
                        <Heading mt="1" color="coolGray.600" _dark={{
                            color: "warmGray.200"
                        }} fontWeight="medium" size="xs">
                            Actualizar contraseña!
                        </Heading>

                        <FormControl>
                            <FormControl.Label>Contraseña actual</FormControl.Label>
                            <Input type={pwdUno ? "text" : "password"}
                                value={pwdActual}
                                onChangeText={setpwdActual}
                                InputRightElement={
                                    <Icon as={<MaterialIcons name={pwdUno ? "visibility-off" : "visibility"} />} onPress={() => setpwdUno(!pwdUno)} size={5} mr="2" color="muted.400" />
                                }
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Nueva contraseña</FormControl.Label>
                            <Input type={pwdDos ? "text" : "password"}
                                value={pwdNueva}
                                onChangeText={setpwdNueva}
                                InputRightElement={
                                    <Icon as={<MaterialIcons name={pwdDos ? "visibility-off" : "visibility"} />} onPress={() => setpwdDos(!pwdDos)} size={5} mr="2" color="muted.400" />
                                }
                            />
                        </FormControl>
                        <FormControl>
                            <FormControl.Label>Repita contraseña</FormControl.Label>
                            <Input type={pwdTres ? "text" : "password"}
                                value={pwdRepita}
                                onChangeText={setpwdRepita}
                                InputRightElement={
                                    <Icon as={<MaterialIcons name={pwdTres ? "visibility-off" : "visibility"} />} onPress={() => setpwdTres(!pwdTres)} size={5} mr="2" color="muted.400" />
                                }
                            />
                        </FormControl>
                        <Button mt="2" isLoading={cargando} isLoadingText="Procesando..." colorScheme={"emerald"} onPress={acceder}>
                            {cargando ? 'Procesando' : 'Actualizar'}
                        </Button>

                    </Box>
                </Box>
            
        </Center>
        </ScrollView>
        
    )
}
