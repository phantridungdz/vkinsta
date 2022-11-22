import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Divider } from 'react-native-elements'
import { BASE_URL } from "../../config";
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

const handleLike = (post, userInfo) => {
  const currentLikeStatus = !post.likes.map(liked => liked.username).includes(
    userInfo.user.username
  )

  currentLikeStatus ? 
  
  axios({
    method: 'patch',
    headers: {Authorization: `${userInfo.access_token}`},
    url: `${BASE_URL}/post/${post._id}/like`,
  }).then((response) => {

  })
  :
  axios({
    method: 'patch',
    headers: {Authorization: `${userInfo.access_token}`},
    url: `${BASE_URL}/post/${post._id}/unlike`,
  }).then((response) => {
    
  })
}

const Posts = ({post, navigation, userInfo}) => {

  return (
    <View style={{ marginBottom: 30}}>
      <Divider width={1} orientation='vertical' />
      <Text style={{color: 'white'}}>{post.likes.id}</Text>
      <PostHeader post={post} navigation={navigation} userInfo={userInfo}/>
      <PostImage post={post} />
      <View style={{marginHorizontal: 15, marginTop:10}}>
        <PostFooter post={post} navigation={navigation} userInfo={userInfo}/>
        <Likes post={post} />
        <Caption post={post}/>
        <Comments post={post} />
        <CommentsSection post={post} navigation={navigation} userInfo={userInfo}/>
      </View>
    </View>
  )
}

const PostHeader = ({post, navigation, userInfo}) =>{
  const user = post.user
  return(
  
    <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 5, alignItems: 'center'}}>
      <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', {userInfo, user})}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={{uri: post.user.avatar }} style={styles.story}/>
          <Text style={{ color: 'white', marginLeft: 5, fontWeight: '700'}} > {post.user.username}</Text>
        </View>
      </TouchableOpacity>
      <Text style={{ color: 'white', fontWeight: '900'}}>...</Text>
    </View>
  )
} 

const PostImage = ({post}) => (
  <View style={{
    width: '100%',
    height: 450,
  }}>
    <Image 
      source={{uri: post.images[0].url}} 
      style={{height: '100%', resizeMode: 'cover'}} 
    />
  </View>
)

const Likes = ({ post }) => (
  <View style={{ marginTop: 5}}>
    <Text style={{flexDirection: 'row', marginTop: 4}}>
      <Text style={{color: 'white', fontWeight: '700'}}>
        {post.likes.length.toLocaleString('en')} likes
      </Text>
  </Text>
  </View>
  
)

const PostFooter = ({post, navigation, userInfo}) => {
  return (
    <View style={{ flexDirection: 'row'}}>
      <View style={styles.leftFooterIconsContainer}>
        <TouchableOpacity onPress={() => handleLike(post, userInfo)}>
          <Image style={styles.footerIcon} source={{uri: post.likes.map(liked => liked.username).includes(
            userInfo.user.username
            ) ? postFooterIcons[0].likedImageUrl
            : postFooterIcons[0].imageUrl
            }}
            />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CommentScreen', {post, userInfo})}>
            <Image style={styles.footerIcon} source={{ uri: postFooterIcons[1].imageUrl}}/>
        </TouchableOpacity>
        
        <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[2].imageUrl}/>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end'}}>
        <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[3].imageUrl}/>
      </View>
    </View>
  )
}

const Caption = ({post}) => (
  <Text style={{ color: 'white'}}>
    <Text style={{ fontWeight: '600'}}>{post.content}</Text>
    <Text> {post.caption}</Text>
  </Text>
)

const CommentsSection = ({post, navigation, userInfo}) => {
  return(
    <View style={{ marginTop: 5}}>
    {!!post.comments.length && (
      <TouchableOpacity onPress={() => navigation.navigate('CommentScreen', {post, userInfo})}>
        <Text style={{ color: 'gray'}}>
          View{post.comments.length > 1 ? ' all' : ''} {post.comments.length}{' '}
          {post.comments.length > 1 ? 'comments...' : 'comment...'}
        </Text>
      </TouchableOpacity>
      )}
    </View>
  )
}

const Comments = ({ post }) => (
  <>
    {post.comments.slice(0,2).map((comment, index) =>(
      <View key={index} style={{ flexDirection: 'row', marginTop: 5}} >
        <Text style={{color: 'white'}}>
          <Text style={{fontWeight: '600'}}>{comment.user.username}
          </Text>{' '}
           {comment.content}
        </Text>
      </View>
    ))}
  </>
)

const Icon = ({imgStyle, imgUrl}) => (
  <TouchableOpacity>
    <Image style={imgStyle} source={{ uri: imgUrl}} />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  story: {
    width:  35,
    height: 35,
    borderRadius: 35,
    margin: 6,
    borderWidth: 1.6,
    borderColor: 'white'
  },

  footerIcon: {
    width:  23,
    height: 23,
    margin: 3
  },

  leftFooterIconsContainer: {
    flexDirection: 'row',
    width: '25%',
    justifyContent: 'space-between'
  }
})

export default Posts