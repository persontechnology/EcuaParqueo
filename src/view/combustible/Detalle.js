import { Center, ScrollView, useToast, Select, Box, CheckIcon, FormControl, Text, Stack, Heading, HStack, Button, Pressable, Image, Avatar, View } from 'native-base'
import React, { useEffect, useState, useContext } from 'react'
import { API_URL } from "@env";
import { AuthContext } from '../../service/AuthContext';
import ImagePicker from 'react-native-image-crop-picker';
import * as Animatable from 'react-native-animatable';
import ReactNativeBlobUtil from 'react-native-blob-util'

import { BottomSheet,ListItem } from '@rneui/themed';

export default function Detalle({ route, navigation }) {
  const urlFotoCamara = "https://pixsector.com/cache/d01b7e30/av7801257c459e42a24b5.png";
  const {
    cantidad_galones,
    cantidad_letras,
    chofer,
    chofer_id,
    codigo,
    concepto,
    destino,
    estado,
    fecha,
    id,
    kilometraje,
    numero,
    observaciones,
    valor,
    valor_letras,
    vehiculo,
  } = route.params;

  const { userToken } = useContext(AuthContext);
  const toast = useToast();
  const [estaciones, setestaciones] = useState([]);
  const [cargandoEstaciones, setcargandoEstaciones] = useState(false);
  let [service, setService] = React.useState("");
  const [cargando, setcargando] = useState(false);

  const [imageData, setimageData] = useState('');
  const [imagePath, setimagePath] = useState(urlFotoCamara);
  const [mostrarBotonFinalizar, setmostrarBotonFinalizar] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [nombreEstacion, setnombreEstacion] = useState('Sin estación');


  const tomarFoto = async () => {
    try {
      await ImagePicker.openCamera({
        width: 300,
        height: 400,
        includeBase64: true,
        cropping: true
      }).then(image => {
        setimageData(image.data)
        setimagePath(image.path)
      });
    } catch (error) {

    }
  }

  const enviarFotox = async () => {
    setcargando(true)

    try {
      const res = await ReactNativeBlobUtil.fetch('POST', API_URL + "dc-enviarFoto", {
        'Authorization': `Bearer ${userToken}`,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      }, [
        { name: 'foto', filename: 'avatar.png', data: imageData },
        { name: 'id', data: id.toString() },
        { name: 'estacion', data: service.toString() },
      ]);

      const data = await res.json();


      if (data === 'ok') {
        toast.show({ 'description': 'Despacho finalizado' });
        setimageData('');
        setService('');
        setestaciones([]);
        setcargando(false);
        setmostrarBotonFinalizar(true);
        setimagePath(urlFotoCamara)
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
      setcargando(false);
    }

  }



  const consultarEstaciones = async () => {
    try {
      const res = await fetch(API_URL + "dc-consulta-estaciones", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });
      const data = await res.json();
      // console.log(data)
      setestaciones(data);

      if (data.codigo === codigo) {
        toast.show({ 'description': 'Revisión finalizado' })
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
      setcargandoEstaciones(true);
    }
  }

  useEffect(() => {
    consultarEstaciones();
  }, []);

  function asignarEstacion(id,nombre){
    setService(id);
    setnombreEstacion(nombre);
    setIsVisible(false);
}


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Center flex={1}>

        <Box mx={1} rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1">

          <Stack p="5">
            <Stack space={2}>
              <Heading size="md" ml="-1">
                {"N° orden: " + numero}
              </Heading>
              <Text fontSize="xs" _light={{
                color: "violet.500"
              }} _dark={{
                color: "violet.400"
              }} fontWeight="500" ml="-0.5" mt="-1">
                {"Concepto: " + concepto}
              </Text>
            </Stack>
            <Text>{"Vehículo: " + vehiculo}</Text>
            <Text>{"Código: " + codigo}</Text>
            <Text>{"Galones: " + cantidad_galones + " (" + cantidad_letras + ")"}</Text>
            <Text>{"Efectivo: " + valor + " (" + valor_letras + ")"}</Text>

            <HStack alignItems="center" space={4} justifyContent="space-between">
              <HStack alignItems="center">
                <Text color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }} fontWeight="400">
                  {"Fecha: " + fecha}
                </Text>
              </HStack>
            </HStack>
          </Stack>
        </Box>


        {
          cargandoEstaciones ? <Box w="95%" >
            <FormControl isRequired isInvalid>
              <FormControl.Label>Selecione una estación</FormControl.Label>
              {/* <Select selectedValue={service} defaultValue={""} minWidth="200" accessibilityLabel="Selecione estación" placeholder="Selecione estación" _selectedItem={{
                bg: "teal.600",

                endIcon: <CheckIcon size="5" />
              }} mt={1} onValueChange={itemValue => setService(itemValue)}>
                {
                  estaciones.map((estacion) => {
                    return <Select.Item key={estacion.id} label={estacion.nombre} value={estacion.id} />
                  })
                }

              </Select> */}

              <Button
                variant={"outline"}
                onPress={() => setIsVisible(true)}
              >{nombreEstacion}</Button>

              <BottomSheet modalProps={{}} isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
                <ListItem
                  key={"a"}
                  onPress={() => asignarEstacion("","Sin estación")}
                >
                  <ListItem.Content>
                    <ListItem.Title >{"Sin estación"}</ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                {estaciones.map((l, i) => (
                  <ListItem
                    key={i}
                    containerStyle={l.containerStyle}
                    onPress={() => asignarEstacion(l.id,l.nombre)}
                  >
                    <ListItem.Content>
                      <ListItem.Title style={l.titleStyle}>{l.nombre}</ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                ))}
                <ListItem
                  key={"aa"}
                  containerStyle={{ backgroundColor: 'red' }}
                  onPress={() => setIsVisible(false)}
                >
                  <ListItem.Content>
                    <ListItem.Title style={{ color: "white" }}>{"Cancelar"}</ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              </BottomSheet>

            </FormControl>


            <Pressable onPress={tomarFoto} style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? 'rgb(210, 230, 255)'
                  : 'white'
              },
            ]}>
              <Center mt={2}>
                <Animatable.View animation="pulse" easing="ease-out" iterationCount={5}>
                  <Avatar bg="dark.500" source={{
                    uri: imagePath
                  }} size="2xl">
                    foto
                    <Avatar.Badge bg={imageData.length > 0 ? 'success.500' : 'danger.500'} />
                  </Avatar>
                </Animatable.View>
                <Text>{imageData.length > 0 ? 'Cambiar foto' : 'Tomar foto'}</Text>
              </Center>
            </Pressable>



            {
              mostrarBotonFinalizar ? (
                <Button mt="2" colorScheme="danger" onPress={() => navigation.goBack()}>
                  Finalizar despacho
                </Button>
              ) : (
                <Button mt="2" colorScheme="emerald" onPress={enviarFotox} isLoadingText={"Enviando..."} isLoading={cargando}>
                  Enviar
                </Button>
              )
            }



          </Box> : <></>
        }

      </Center>
    </ScrollView>
  )
}
