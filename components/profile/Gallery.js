import { View, Text, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import ImageGallery from './ImageGallery'

const dimensions = Dimensions.get('window');
const Gallery = ({post}) => {
  const screenHeight = Math.round(dimensions.width)
  const screenWidth = dimensions.width
  return (
    <FlatList
      style={{flexDirection: 'row', width: 500}}
      data={post}
      numColumns={3}
      keyExtractor={(item) => item.id}
      renderItem={({ item: message }) =>{
        return (
          <ImageGallery key={message._id} message={message}/>
        )
      }}
    >
    </FlatList>
  )
}

export default Gallery