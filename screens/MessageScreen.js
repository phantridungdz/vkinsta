import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput, Button, TouchableWithoutFeedback, FlatList, Keyboard, Dimensions } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import * as Yup from 'yup'
import ReceiverMessage from '../components/chat/ReceiverMessage'
import SenderMessage from '../components/chat/SenderMessage'
import ImagePicker from 'react-native-image-crop-picker';
import { BASE_URL } from "../config";
import axios from 'axios'

const dimensions = Dimensions.get('window');
const MessesageScreen = ({navigation, route}) => {
  const imageHeight = Math.round(dimensions.width * 9 / 25);
  const imageWidth = dimensions.width* 9 / 16;
  const {user} = route.params
  const {conversation} = route.params
  const {userInfo} = route.params
  const [file, setFile] = useState(null)
  const [messages, setMessages] = useState(false)

  axios({
    method: 'get',
    headers: {Authorization: `${userInfo.access_token}`},
    url: `${BASE_URL}/message/${user._id}`,
  }).then((response) => {
    let allchat = response.data
    setMessages(allchat)
  });
  
  
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false)
  const [image, setImage] = useState(null)
  const pickImage = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(result => {
      const imageUri = Platform.OS === 'ios' ? result.path : result.uri
      setImage(imageUri)
      let file = { uri: result.path, type: "image", name: result.filename }
      setFile(file)
      const uploadUri = image
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', 'upload_image')
      data.append('cloud_name', 'ddnv4r9pb')
      // data.append('api_key', 'OA-GG3RuBpzUphm64O4mZfRqNmY')
      fetch("https://api.cloudinary.com/v1_1/ddnv4r9pb/image/upload", {
        method: 'post',
        body: data,
        header: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      }).then(res =>
        res.json()
      ).then(data => {
        console.log(data)
        axios
        .post(`${BASE_URL}/message`, {
          "conversation": conversation,
          "sender": userInfo.user._id,
          "recipient": user._id,
          "text": input,
          "media": {url: data.secure_url, public_id: data.public_id},
          "call":""
        }, {headers: {Authorization: `${userInfo.access_token}`}})
        .then(res => {
          setInput("")
        })
        .catch(e => {
          console.log(`commnent error ${e}`)
        })
      })
    });
  }
  
  const sendMessage = () => {
    
    if(input != ''){
      axios
      .post(`${BASE_URL}/message`, {
        "conversation": conversation,
        "sender": userInfo.user._id,
        "recipient": user._id,
        "text": input,
        "media": [],
        "call":""
      }, {headers: {Authorization: `${userInfo.access_token}`}})
      .then(res => {
        setInput("")
      })
      .catch(e => {
        console.log(`commnent error ${e}`)
      })
    }
    setInput('')
  }

  const showImage = image => {
    navigation.navigate('ImageShowFullScreen', {
      image: image,
    })
  }
  const audioCallHandle = () => {
    navigation.navigate('AudioCallScreen', {
      caller: userInfo,
      callUser: user
    })
  }
  const likeMessage = id => {
    db.collection('users').doc(user.email).collection('chat').doc(userCurrent[0].email).collection('messages').doc(id).update({
      like: true,
    })
    db.collection('users').doc(userCurrent[0].email).collection('chat').doc(user.email).collection('messages').doc(id).update({
      like: true,
    })
  }

  
  return (
    <SafeAreaView style={{ backgroundColor: 'black', flex: 1}}>
      <Header navigation={navigation} users={user} audioCallHandle={audioCallHandle}>
      </Header>
      <View width={20}><Text></Text></View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <ScrollView>
            {messages?.messages &&messages.messages.reverse().map((data, id) => {
              return(
                data.sender === userInfo.user._id ? 
                (
                  data.media.length > 0 ?
                  <TouchableOpacity key={id} onPress={() => showImage(data.media[0].url)} onLongPress={() => {console.log('Long Press')}} delayLongPress={700}>
                    <View style={{flexDirection: 'row', alignSelf: 'flex-end',  maxWidth: '80%', borderRadius: 25, margin: 10}} key={id}>
                      <Image 
                        source={{ uri: data.media[0].url}} 
                        style={{
                          width: imageWidth,
                          height: imageHeight,
                          borderRadius: 15
                        }} 
                      />
                    </View>
                  </TouchableOpacity>
                  :
                  data.like ?
                    <TouchableOpacity key={id} onLongPress={() =>  likeMessage(id)} delayLongPress={700}>
                      <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                        <View  style={{ width: 35, height: 20, borderRadius: 10, alignSelf:'flex-end', alignItems: 'center', backgroundColor: '#4f4d54', zIndex: 100, bottom: 12, left: 30}}>
                          <Image source={{ uri: 'https://img.icons8.com/fluency/96/000000/hearts.png'}} 
                            style={{width: 15, height: 15, top: 2}}
                          />
                        </View>
                        
                        <View key={id} style={styles.reciever}>
                          <Text style={{color: 'white', fontWeight: '700'}}>{data.text}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  :
                    <TouchableOpacity key={id} onLongPress={() =>  likeMessage(id)} delayLongPress={700}>
                        <View key={id} style={styles.reciever}>
                          <Text style={{color: 'white', fontWeight: '700'}}>{data.text}</Text>
                        </View>
                    </TouchableOpacity>
                ):(
                data.media.length > 0 ?
                <TouchableOpacity key={id} onPress={() => showImage(data.message)}>
                  <View style={{flexDirection: 'row', alignSelf: 'flex-start',  maxWidth: '80%', borderRadius: 25}} key={id}>
                    <Image 
                      source={{ uri: user.avatar}} 
                      style={{
                        
                        width: 35, 
                        height: 35,
                        borderRadius: 17
                      }} 
                    />
                    <Image 
                      source={{ uri: data.media[0].url}} 
                      style={{
                        marginLeft: 10,
                        marginBottom: 10,
                        width: imageWidth,
                        height: imageHeight,
                        borderRadius: 15
                      }} 
                    />
                  </View>
                </TouchableOpacity>
                
                :
                <View key={id} style={{flexDirection: 'row', maxWidth: '80%',}}>
                  <Image 
                    source={{ uri: user.avatar}} 
                    style={{
                      width: 35, 
                      height: 35,
                      borderRadius: 17
                    }} 
                  />
                  <View style={styles.sender}>
                    <Text style={{flex: 150,color: 'white', fontWeight: '700'}}>{data.text}</Text>
                  </View>
                  <Text></Text>
                </View>
              )
              )}
              )
            }
              
          </ScrollView>
        </>
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}   keyboardVerticalOffset={10}>
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#232224',
          borderRadius: 20,
        }}>
        <TouchableOpacity onPress={pickImage} style={{flex: 1,}}>
          <Image source={{ uri: 'https://platinmods.com/attachments/open-camera-v1-48-2-mod-adfree-apk-png.244753/'}} style={{ width: 45, height: 45, borderRadius: 15 }} />
        </TouchableOpacity>
        
        <View style={{
          marginRight: 10,
          flex:11,
          flexDirection: 'row', 
          justifyContent: 'space-between'
        }}>
            
            <TextInput
                style={{
                  maxWidth: 300,
                  marginLeft: 10,
                  paddingLeft: 8,
                }}
                color='white'
                placeholderTextColor="white"
                placeholder={"Send Message.."}
                onChangeText={setInput}
                value={input}
            >
              
            </TextInput>
            <TouchableOpacity onPress={() => sendMessage()} style={{justifyContent: 'center', marginRight: 10}} >
              <Text style={{color: '#088ecc', fontWeight: '600'}}>Send</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const Header = ({navigation, users, audioCallHandle}) => (
  <View style={styles.headerContrainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={{alignItems: 'center',}}>
          <Image source={{ uri: 'https://img.icons8.com/material/24/ffffff/back--v1.png'}} style={{ width: 35, height: 35}}></Image>
        </View>
    </TouchableOpacity>
    <Image source={{ uri: users.avatar}} style={{ width: 38, height: 38, borderRadius: 50, borderColor: 'white', borderWidth: 2}}></Image>
    <Text style={styles.headerText}>{users.username}</Text>
    <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end',}}>
      <TouchableOpacity onPress={audioCallHandle} style={{alignSelf: 'flex-end'}}>
        <Image source={{ uri: 'https://img.icons8.com/ios/24/ffffff//phone.png'}} style={{ width: 28, height: 28, resizeMode: 'contain',   marginRight: 25}}></Image>
      </TouchableOpacity>
      <TouchableOpacity style={{alignSelf: 'flex-end'}}>
        <Image source={{ uri: 'https://img.icons8.com/ios/24/ffffff/video-call.png'}} style={{ width: 28, height: 28, resizeMode: 'contain',  marginRight: 35}}></Image>
      </TouchableOpacity>
    </View>
    
    
  </View>
)

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  reciever: {
    padding: 12,
    backgroundColor: '#7630e6',
    alignSelf: 'flex-end',
    borderRadius: 30,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative'
  },
  sender: {
    marginLeft: 10,
    padding: 12,
    backgroundColor: '#4f4d54',
    alignSelf: 'flex-start',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    position: 'relative'
  },
  headerContrainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerText: {
    alignItems: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    marginRight: 25,
    margin: 10
  },

})

export default MessesageScreen