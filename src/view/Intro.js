import React from 'react'
import {View, Text, Image, StyleSheet, StatusBar,Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppIntroSlider from 'react-native-app-intro-slider';
import {API_NAME} from "@env"
import * as Animatable from 'react-native-animatable';


const data = [
    {
      title: API_NAME,
      text: 'Mantén el control de uno o más espacios destinados al estacionamiento de vehículos.',
      image: require('../public/img/1.png'),
      bg: '#59b2ab',
    },
    {
      title: 'Registro de vehículo, ya sea motocicleta, auto, camionetas, etcétera.',
      text: 'Simplifica tu gestión con nuestra plataforma, utilizando dispositivos móviles y aplicación web.',
      image: require('../public/img/2.png'),
      bg: '#febe29',
    },
    {
      title: 'App Smartphone',
      text: "Sus clientes podrán consultar las tarifas, entrar al estacionamiento y pagar con el smartphone.",
      image: require('../public/img/3.png'),
      bg: '#22bcb5',
    },
  ];

  const { width, height } = Dimensions.get('window');



  const styles = StyleSheet.create({
    slide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
        width: (width*0.50)/2, 
        height: (width*0.50)/2 ,
        marginVertical: 32,
    },
    text: {
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
    },
    title: {
      fontSize: 22,
      color: 'white',
      textAlign: 'center',
    },
    buttonCircle: {
      width: 44,
      height: 44,
      backgroundColor: 'rgba(0, 0, 0, .2)',
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
export default function Intro({navigation}) {


    const _renderItem = ({item}: {item: Item}) => {
        return (
          <View
            style={[
              styles.slide,
              {
                backgroundColor: item.bg,
              },
            ]}>
            <Animatable.Text animation="pulse"  iterationCount="infinite" style={styles.title}>{item.title}</Animatable.Text>
            <Animatable.Image animation="swing" easing="ease-out" iterationCount="infinite" source={item.image} style={styles.image} ></Animatable.Image>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        );
      };
    
      const _keyExtractor = (item: Item) => item.title;
    
      const _renderNextButton = () => {
        return (
          <Animatable.View animation={"zoomIn"} iterationCount="infinite" style={styles.buttonCircle}>
            <Icon
              name="md-arrow-forward"
              color="rgba(255, 255, 255, .9)"
              size={24}
            />
          </Animatable.View>
        );
      };


  const _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="md-checkmark" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };


  return (
    <View style={{flex: 1}}>
    {/* <StatusBar translucent backgroundColor="transparent" /> */}
    <AppIntroSlider
      keyExtractor={_keyExtractor}
      renderDoneButton={_renderDoneButton}
      renderNextButton={_renderNextButton}
      renderItem={_renderItem}
      data={data}
      onDone={()=>navigation.navigate('Login')}
    />
  </View>
  )
}
