import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { Button } from 'react-native-elements'
import Gallery from '../components/profile/Gallery'
import { BASE_URL } from "../config";
import axios from 'axios'
import { PostContext } from '../context/PostContext';
import BottomTabs, { bottomTabIcons } from '../components/home/BottomTabs'

const ProfileScreen = ({navigation, route}) => {
  const {user} = route.params
  const {userInfo} = route.params
  const [userReading, setUserReading] = useState(false)
  const {postByUsername, postUser} = useContext(PostContext)
  const [allUsers, setAllUsers] = useState([])
  axios({
    method: 'get',
    headers: {Authorization: `${userInfo.access_token}`},
    url: `${BASE_URL}/user`,
  }).then((response) => {
    let allusers = response.data.users
    setAllUsers(allusers)
  });

  axios({
    method: 'get',
    headers: {Authorization: `${userInfo.access_token}`},
    url: `${BASE_URL}/user/${user._id}`,
  }).then((response) => {
    let userReading = response.data.user
    setUserReading(userReading)
  });
  
  postByUsername(userInfo, user)
  
  const gotoMessage = user => {
    navigation.navigate('MessesageScreen', {
      user: user
    })
  }
  const gotoEditFrofileScreen = user => {
    navigation.navigate('EditProfileScreen', {
      user: user
    })
  }
  const handleGotoProfile = (user) => {
    navigation.navigate('ProfileScreen', {
      user: user
    })
  }
  const handleFollow = ( id, followed ) => {
    followed ? 
    
    axios({
      method: 'patch',
      headers: {Authorization: `${userInfo.access_token}`},
      url: `${BASE_URL}/user/${id}/unfollow`,
    }).then((response) => {

    })
    :
    axios({
      method: 'patch',
      headers: {Authorization: `${userInfo.access_token}`},
      url: `${BASE_URL}/user/${id}/follow`,
    }).then((response) => {

    })
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'black', flex: 1}}>
      <Header navigation={navigation} userInfo={userInfo}>
      </Header>
      <View style={{flexDirection: 'row'}}>
        <View style={{ flex: 0.8, alignItems: 'center'}}> 
          <Image source={{ uri: userReading.avatar}} style={{ width: 100, height: 100, borderRadius: 50}}></Image>
          <Text style={{color: 'white', textAlign: 'center', fontWeight:'900'}}>{userReading.username}</Text>
          <Text style={{color: 'white', textAlign: 'center', fontWeight:'400', fontSize: 11}}>{userInfo.story}</Text>
        </View>
        
        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', width: 200}}>
          <View style={{alignItems: 'center'}}>
            {postUser?.post  && (
              <Text style={{color: 'white', fontWeight:'900'}}>{postUser?.post.length.toLocaleString('en') ?? "0"}</Text>
            )}
            
            <Text style={{color: 'white', fontWeight:'400', fontSize: 11}}>Post</Text>
          </View>
          <View style={{alignItems: 'center', left: 20}}>
            {userReading?.followers  && (
              <Text style={{color: 'white', fontWeight:'900', }}>{userReading?.followers.length.toLocaleString('en') ?? "0"}</Text>
            )}
            <Text style={{color: 'white', fontWeight:'400', fontSize: 11}}>Follower</Text>
          </View>
          <View style={{alignItems: 'center', left: 40}}>
            {userReading?.following  && (
              <Text style={{color: 'white', fontWeight:'900', }}>{userReading?.following.length.toLocaleString('en') ?? "0"}</Text>
            )}
            <Text style={{color: 'white', fontWeight:'400', fontSize: 11}}>Following</Text>
          </View>
        </View>
      </View>
      {userInfo.user?.email == userReading.email || userInfo.email == userReading.email
      ? 
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: '', margin: 10}}>
          <TouchableOpacity style={{flex: 1}} onPress={()=> gotoEditFrofileScreen(userInfo)}>
            <View style={{borderWidth: 0.5, flex:1 ,borderColor: 'gray', borderRadius: 5, padding: 5, marginRight: 5}}>
              <Text style={{color: 'white', textAlign: 'center', fontWeight: '900', padding:2}}>Edit Profile</Text>
            </View>
          </TouchableOpacity>
          <View style={{borderWidth: 0.5,  borderColor: 'gray', borderRadius: 5, padding: 5}}>
            <Image source={{uri: 'https://img.icons8.com/fluency-systems-filled/144/ffffff/add.png'}} style={{ width: 21, height: 21}}></Image>
          </View>
        </View>
        <DiscoverPeople></DiscoverPeople>
        <UserNeedFollow allUsers={allUsers} userInfo={userInfo} userReading={userReading} handleFollow={handleFollow}></UserNeedFollow>
        <View>
          {postUser?.post  && (
            <Gallery post={postUser.post}></Gallery>
          )}
        </View>
      </View>
      :
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: '', margin: 10}}>
          <TouchableOpacity onPress={() => handleFollow(userReading._id, userReading.followers.filter(followed => followed._id === userInfo.user._id).length > 0)} style={{flex: 1}}>
          { userReading?.followers &&
            userReading.followers.filter(followed => followed._id === userInfo.user._id).length > 0
              ?
              <View style={{borderWidth: 0.5, borderColor: 'gray',  borderRadius: 5, padding: 5, marginRight: 5}}>
                <Text style={{color: 'white', textAlign: 'center', fontWeight: '900', padding:2}}>Following</Text>
              </View>
              :
              <View style={{borderWidth: 0.5, borderColor: 'gray', backgroundColor: '#1698f5', borderRadius: 5, padding: 5, marginRight: 5}}>
                <Text style={{color: 'white', textAlign: 'center', fontWeight: '900', padding:2}}>Follow</Text>
              </View>
          }
          </TouchableOpacity>
          
          <TouchableOpacity style={{flex: 1}} onPress={()=> gotoMessage(user)}>
            <View style={{borderWidth: 0.5 ,borderColor: 'gray', borderRadius: 5, padding: 5, marginRight: 5}}>
              <Text style={{color: 'white', textAlign: 'center', fontWeight: '900', padding:2}}>Message</Text>
            </View>
          </TouchableOpacity>
          
          <View style={{borderWidth: 0.5,  borderColor: 'gray', borderRadius: 5, padding: 5}}>
            <Image source={{uri: 'https://img.icons8.com/fluency-systems-filled/144/ffffff/add.png'}} style={{ width: 21, height: 21}}></Image>
          </View>
        </View>
        <DiscoverPeople></DiscoverPeople>
        <UserNeedFollow allUsers={allUsers} userInfo={userInfo} userReading={userReading} handleFollow={handleFollow}></UserNeedFollow>
        <View>
          {postUser?.post  && (
            <Gallery post={postUser.post}></Gallery>
          )}
        </View>
      </View> 
      }
      <BottomTabs icons={bottomTabIcons} navigation={navigation} userInfo={userInfo}/>
    </SafeAreaView>
  )
}
const Header = ({navigation, userInfo}) => (
  <View style={styles.headerContrainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <View>
          <Image source={{ uri: 'https://img.icons8.com/material/24/ffffff/back--v1.png'}} style={{ width: 35, height: 35}}></Image>
        </View>
    </TouchableOpacity>
    <Text style={styles.headerText}>{userInfo.username}</Text>
  </View>
)
const DiscoverPeople = () => (
  <View style={{flexDirection: 'row', justifyContent: 'center', margin: 10}}>
    <View style={{flex:1, padding: 5, marginRight: 5}}>
      <Text style={{color: 'white', textAlign: 'left', fontWeight: '700', fontSize: 12, padding:2}}>Discover people</Text>
    </View>
    <View style={{flex:1, padding: 5, marginRight: 5}}>
      <Text style={{color: 'white', textAlign: 'right', color: '#1698f5', fontWeight: '700', fontSize: 12, padding:2}}>See all</Text>
    </View>
  </View>
)
const UserNeedFollow = ({allUsers, userInfo, userReading, handleFollow}) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {allUsers?.map && allUsers.map((profile, index) => (
        profile._id == userInfo.user._id || profile._id == userReading._id?
        <View key={index}></View>
        :
        <View key={index} style={{alightItems: 'center', width: 160, height: 200, alignItems: 'center', justifyContent:'center', borderWidth: 0.2, borderColor: 'gray', margin: 5.5}}>
            <TouchableOpacity onPress={() => handleGotoProfile(profile)}>
              <Image source={{uri: profile.avatar}} style={styles.profile}/>
            </TouchableOpacity>
            <Text style={{ color: 'white'}}>
            {profile.username.length > 11 
            ? profile.username.slice(0, 10).toLocaleLowerCase() + '...'
            : profile.username.toLocaleLowerCase()}
            </Text>
            <TouchableOpacity style={{textAlign: 'bottom'}} onPress={() => handleFollow(profile._id, profile.followers.includes(
                userInfo.user._id))}>
              {profile.followers.includes(
                userInfo.user._id)
                ?
                <View style={{borderWidth: 0.5,borderColor: 'gray', borderRadius: 5, padding: 5, paddingLeft:20, paddingRight: 20, marginTop: 10}}>
                  <Text style={{color: 'white', textAlign: 'center', fontWeight: '900', padding:2}}>Following</Text>
                </View>
                :
                <View style={{borderWidth: 0.5,borderColor: 'gray', borderRadius: 5, padding: 5, paddingLeft:20, paddingRight: 20, marginTop: 10, backgroundColor: '#1698f5'}}>
                  <Text style={{color: 'white', textAlign: 'center', fontWeight: '900', padding:2}}>Follow</Text>
                </View>
              }
            </TouchableOpacity>
          
        </View>
      
    ))}
  </ScrollView>
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
  profile: {
    margin: 10,
    width:  70,
    height: 70,
    borderRadius: 35,
    margin: 5,
  }
})

export default ProfileScreen