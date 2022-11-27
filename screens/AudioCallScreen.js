import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useDispatch , useState, useRef} from 'react'
import {RTCView, mediaDevices, MediaStream, RTCPeerConnection} from 'react-native-webrtc';
import IO, { Socket } from 'socket.io-client';
import Peer from 'react-native-peerjs';

export 

const AudioCallScreen = ({navigation, route}) => {
  const [videoCall, setVideoCall] = useState()
  const [idCall, setIdCall] = useState()
  const [tracks, setTracks] = useState(null)
  var idCallTest = ''
  const {callUser} = route.params
  const {caller} = route.params
  const otherVideo = useRef()

  // let isFront = true;
  // mediaDevices.enumerateDevices().then((sourceInfos) => {
  //   let videoSourceId;
  //   for (let i = 0; i < sourceInfos.length; i++) {
  //     const sourceInfo = sourceInfos[i];
  //     if (
  //       sourceInfo.kind == 'videoinput' &&
  //       sourceInfo.facing == (isFront ? 'front' : 'environment')
  //     ) {
  //       videoSourceId = sourceInfo.deviceId;
  //     }
  //   }


  //   mediaDevices
  //     .getUserMedia({
  //       audio: true,
  //       video: {
  //         mandatory: {
  //           minWidth: 500,
  //           minHeight: 300,
  //           minFrameRate: 30,
  //         },
  //         facingMode: isFront ? 'user' : 'environment',
  //         optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
  //       },
  //     })
  //     .then((stream) => {
  //       setVideoCall(stream)
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // });

  const API_URI = `https://vkinsta.com`
  const socket = IO(`${API_URI}`, {
    transports: ['websocket'], jsonp: false 
  });   
  socket.connect(); 
  socket.on('connect', () => { 
    console.log('connected to socket server', socket); 
  });

  const avatar = caller.user.avatar
  const username = caller.user.username
  const fullname = caller.user.fullname
  const video = true

  const msg = {
    sender: caller.user._id,
    recipient: callUser._id, avatar, username, fullname, video
  }

  const peerServer = new Peer(undefined, {
    path: '/', 
    secure: true,
    port: 443,
    config: {
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
          ],
        },
      ],
    },
  })
  console.log('peerserver', peerServer)
  peerServer.on('error', (err) =>
    console.log('Peer server error', err),
  );
  
  peerServer.on('call', data => {
    console.log('peer1: ' + data)
    // const track = videoCall.getTracks()
    // console.log('asdklajsdlkasd')
    // console.log(track)
    // setTracks(track)

    // newCall.answer(videoCall)
    // newCall.on('stream', function(remoteStream){

    // })
  })
  
 

  socket.on('connect', () => {
    // setIdCall(socket.id)
    console.log( 'connect socket',socket)
    socket.emit('callUser', msg)
    
    
  });
  
  
  return (
  <SafeAreaView style={{ backgroundColor: 'black', flex: 1}}>
    <Header navigation={navigation}></Header>
    {videoCall
      ? 
      <RTCView
        streamURL={videoCall.toURL()}
        style={{width: 300, height: 200, borderWidth: 5, backgroundColor: "pink", borderColor: 'white'}}
      />
      :
      <></>}
    </SafeAreaView>
  )
}

const Header = ({navigation, users}) => (
  
    <View style={styles.headerContrainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <View>
            <Image source={{ uri: 'https://img.icons8.com/material/24/ffffff/back--v1.png'}} style={{ width: 35, height: 35}}></Image>
          </View>
      </TouchableOpacity>
      <Text style={styles.headerText}>Calling...</Text>
    </View>
  
)

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
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

})


export default AudioCallScreen
// export default connect(mapStateToProps, {joinRoom, catchEm})(AudioCallScreen);