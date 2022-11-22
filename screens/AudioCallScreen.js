import { View, Text } from 'react-native'
import React, { useEffect, useDispatch , useState, useRef} from 'react'
// import {RTCView, mediaDevices} from 'react-native-webrtc';
import IO, { Socket } from 'socket.io-client';
import Peer from 'react-native-peerjs';
import {connect} from 'react-redux';

export 

const AudioCallScreen = ({navigation, route}) => {
  const [videoCall, setVideoCall] = useState()
  const {callUser} = route.params
  const {caller} = route.params
  const otherVideo = useRef()

  const API_URI = `https://vkinsta.com`
  const socket = IO(`${API_URI}`, {
    forceNew: true,
  });
  const peerServer = new Peer(undefined, {
    path: '/', secure: true
  })

  const avatar = caller.user.avatar
  const username = caller.user.username
  const fullname = caller.user.fullname
  const video = caller.user.video

  const msg = {
    sender: caller.user._id,
    recipient: callUser._id, avatar, username, fullname, video
  }

  socket.on('callUser', ()=> console.log("Connected"))
  socket.emit('callUser', msg)
  let isFront = true;
  mediaDevices.enumerateDevices().then((sourceInfos) => {
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if (
        sourceInfo.kind == 'videoinput' &&
        sourceInfo.facing == (isFront ? 'front' : 'environment')
      ) {
        videoSourceId = sourceInfo.deviceId;
      }
    }
    mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          mandatory: {
            minWidth: 500,
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode: isFront ? 'user' : 'environment',
          optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
        },
      })
      .then((stream) => {
        console.log('Unseder Here !')
        setVideoCall(stream)
        onVideoCall(stream)
      })
      .catch((error) => {
        console.log(error);
      });
  });
  const onVideoCall = (stream) => {
    peerServer.on('call', newCall => {
      newCall.answer(stream)
      newCall.on('stream', function(remoteStream) {
          if(otherVideo.current){
              playStream(otherVideo.current, remoteStream)
          }
      });
  
    })
  }
  
  
  return (
    <View>
      {/* <RTCView
        streamURL={videoCall.toURL()}
        style={{width: 300, height: 200}}
      /> */}
    </View>
  )
}


export default AudioCallScreen
// export default connect(mapStateToProps, {joinRoom, catchEm})(AudioCallScreen);