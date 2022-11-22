import IO from 'socket.io-client';
import Peer from 'react-native-peerjs';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {ID} from './authActions';

/** Web RTC */
import {mediaDevices} from 'react-native-webrtc';

//** API_URI */
export const API_URI = `https://vkinsta.com`;

const peerServer = new Peer(undefined, {
  path: '/', secure: true
})

peerServer.on('callUser', console.log);

//** Socket Config */
export const socket = IO(`${API_URI}`, {
  forceNew: true,
});

socket.on('connection', () => console.log('Connection'));

export const joinGeneralRoom = () => async (dispatch) => {
  socket.emit('callUser', {"sender":"6375c65b7a695e04eef6223b","recipient":"6375111ae61fe30d54ce9aa6","avatar":"https://randomuser.me/api/portraits/women/4.jpg","username":"phantridungdz","fullname":"Phan Trí Dũng"});
};

export const userJoin = () => async (dispatch, getState) => {};

// Stream Actions
export const joinStream = (stream) => async (dispatch, getState) => {};

export const disconnect = () => async () => {
  // peerServer.disconnect();
};

export const stream = () => async (dispatch) => {
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
        dispatch(joinStream(stream));
      })
      .catch((error) => {
        console.log(error);
      });
  });
};