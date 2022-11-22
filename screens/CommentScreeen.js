import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Button, TouchableWithoutFeedback, TextInput, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import { BASE_URL } from "../config";
import axios from 'axios'

const postFooterIcons = [
  {
    name: 'Like',
    imageUrl: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/like.png',
    likedImageUrl: 'https://img.icons8.com/fluency/96/000000/hearts.png'
  },
  {
    name: 'Comment',
    imageUrl: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/topic.png',
  },
  {
    name: 'Share',
    imageUrl: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/paper-plane.png',
  },
  {
    name: 'Save',
    imageUrl: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/bookmark-ribbon--v1.png',
  },
]

const handleLikeComent = (comment, userInfo) => {
  const currentLikeComment = !comment.likes.map(liked => liked.username).includes(
    userInfo.user.username
  )

  currentLikeComment ? 
  axios({
    method: 'patch',
    headers: {Authorization: `${userInfo.access_token}`},
    url: `${BASE_URL}/comment/${comment._id}/like`,
  }).then((response) => {

  })
  :
  axios({
    method: 'patch',
    headers: {Authorization: `${userInfo.access_token}`},
    url: `${BASE_URL}/comment/${comment._id}/unlike`,
  }).then((response) => {

  })
}



const CommentScreeen = ({route, navigation}) => {
  const { post } = route.params;
  const { userInfo } = route.params
  const [postRead, setPostRead] = useState(post)
  axios({
    method: 'get',
    headers: {Authorization: `${userInfo.access_token}`},
    url: `${BASE_URL}/post/${post._id}`,
  }).then((response) => {
    let allpost = response.data.post
    setPostRead(allpost)
  });

  const [input, setInput] = useState("");
  let postid = post._id
  let userid = userInfo._id
  const sendComment = () => {
    axios
    .post(`${BASE_URL}/comment`, {
      "postId": postid,
      "content": input,
      "postUserId": userid
    }, {headers: {Authorization: `${userInfo.access_token}`}})
    .then(res => {
      setInput("")
    })
    .catch(e => {
      console.log(`commnent error ${e}`)
    })
  }

  
  return (
    <SafeAreaView style={{ backgroundColor: 'black', flex: 1}}>
      <Header navigation={navigation}>
      </Header>
        <ScrollView>
          {postRead.comments.map((comment, index) =>(
            <Comment comment={comment} key={index} post={postRead} userInfo={userInfo} />
          ))}
        </ScrollView>
      <KeyboardAvoidingView  
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{}}
      keyboardVerticalOffset={10}>
        
        <View style={{
          flexDirection: 'row',
        }}>
        <Image 
          source={{ uri: userInfo.user.avatar}} 
          style={{
            flex: 1,
            width: 35, 
            height: 35,
            borderRadius: 15
          }} 
        />
        <View style={{
          marginLeft: 10,
          marginRight: 10,
          flex:11,
          flexDirection: 'row', 
          borderWidth: 0.5, 
          borderColor: 'gray',
          borderRadius: 20,
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
                placeholder={"Send Comment.."}
                onChangeText={setInput}
                value={input}
            >
              
            </TextInput>
            <TouchableOpacity onPress={() => sendComment()} style={{justifyContent: 'center', marginRight: 10}} >
              <Text style={{color: '#088ecc'}}>Send</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const Header = ({navigation}) => (
  <View style={styles.headerContrainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <View>
          <Image source={{ uri: 'https://img.icons8.com/material/24/ffffff/back--v1.png'}} style={{ width: 35, height: 35}}></Image>
        </View>
    </TouchableOpacity>
    <Text style={styles.headerText}>Comments</Text>
    <Text></Text>
  </View>
)
const dateToFormat = '1976-04-19T12:59-0500';
const Comment = ({ comment, navigation, userInfo }) => {
  return (
    <View style={{ marginBottom: 10}}>
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <Image source={{uri: comment.user.avatar }} style={styles.story}/>
        <View style={{ flex: 12}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{ fontWeight: '600', fontSize: 14, color: 'white'}}>{comment.user.username} </Text>
            <Text style={{ color: 'white', fontSize: 13 }}>{comment.content} </Text>
          </View>
          
          <View style={{flexDirection: 'row'}}>
            <Moment style={{flex:0.3, color: 'gray', fontSize: 10 }} element={Text} interval={30000} fromNow>
                {comment.createdAt}
            </Moment>
            {comment.likes.length > 0 ? <TouchableOpacity style={{flex:0.2}}><Text style={{ color: 'gray', fontSize: 10, fontWeight:'600' }}>{comment.likes.length.toLocaleString('en')} Likes </Text></TouchableOpacity>: ''}
            <TouchableOpacity style={{flex: 0.2}}>
              <Text style={{ color: 'gray', fontSize: 10, fontWeight:'600' }}>
                Reply
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex: 0.2}}>
              <Text style={{ color: 'gray', fontSize: 10, fontWeight:'600' }}>
                Send
              </Text>
            </TouchableOpacity>
            <View style={{flex: 0.5}}></View>
          </View>
        </View>
        <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[0].imageUrl} comment={comment} userInfo={userInfo}/>
      </View>
    </View>
  )
}

const Icon = ({comment, userInfo}) => (
  <TouchableOpacity onPress={() => handleLikeComent(comment, userInfo)}>
    <Image style={styles.footerIcon} source={{uri: comment.likes.map(liked => liked.username).includes(
      userInfo.user.username
      ) ? postFooterIcons[0].likedImageUrl
      : postFooterIcons[0].imageUrl
      }}
    />
  </TouchableOpacity>
)


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  headerContrainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  headerText: {
    alignItems: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    marginRight: 25,
  },
  story: {
    flex: 1.1,
    width:  35,
    height: 35,
    borderRadius: 35,
    margin: 6,
    borderWidth: 1.6,
    borderColor: 'white'
  },

  footerIcon: {
    width:  33,
    height: 33,
    margin: 3
  },

  // footerIcon: {
  //   transform: [{rotate: '320deg'}],
  //   marginTop: -3,
  // },
  footerIcon: {
    width:  17,
    height: 17,
    margin: 3
  },

  leftFooterIconsContainer: {
    flexDirection: 'row',
    width: '32%',
    justifyContent: 'space-between'
  }

})

export default CommentScreeen