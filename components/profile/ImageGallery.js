import { View, Text, Image, Dimensions } from 'react-native'
import React from 'react'

const dimensions = Dimensions.get('window');
const ImageGallery = ({message}) => {
  const screenHeight = Math.round(dimensions.width)
  const screenWidth = dimensions.width /3
  return (
    <View style={{flex: 1, margin: 1}}>
      <Image source={{uri: message.images[0].url}} style={{width:screenWidth, height:140}}></Image>
    </View>
  )
}

export default ImageGallery