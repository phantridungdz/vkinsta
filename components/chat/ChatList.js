import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'

const ChatList = ({chats, navigation, userInfo}) => {

  const gotoMessage = (user, conversation) => {
    navigation.navigate('MessesageScreen', {
      user: user,
      userInfo: userInfo,
      conversation: conversation
    })
  }
  return (
    <>
      {chats.map((data, id) =>{
        return(
        <TouchableOpacity key={id} onPress={() => gotoMessage(data.recipients.filter(chats => chats._id != userInfo.user._id)[0], chats[0]._id)}>
            <View style={{flexDirection: 'row', marginBottom: 20, maxWidth: '80%',}} key={id} >
            <Image 
              source={{ uri: data.recipients.filter(chats => chats._id != userInfo.user._id)[0].avatar}} 
              style={{
                width: 50, 
                height: 50,
                borderRadius: 25
              }} 
            />
            <View style={{ margin: 10}}>
              <Text style={{flex: 150,color: 'white', fontWeight: '700'}}>{data.recipients.filter(chats => chats._id != userInfo.user._id)[0].username}</Text>
              <Text style={{flex: 150,color: 'gray', fontWeight: '600', fontSize: 12}}>{data.text}</Text>
            </View>
            <Text></Text>
          </View>
        </TouchableOpacity>
        )
      })}
    </>
  )
}

export default ChatList