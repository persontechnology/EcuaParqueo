import { Box, Button } from 'native-base'
import React from 'react'

export default function Configuracion({navigation}) {
  return (
    <Box>
        <Button onPress={() => navigation.navigate('Details')}>IR A DETALLE</Button>
    </Box>
  )
}
