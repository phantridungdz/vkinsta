import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import React, { useContext, useState , useEffect} from 'react'
import Header from "../components/home/Header"
import Stories from '../components/home/Stories'
import Posts from '../components/home/Posts'
import { BASE_URL } from "../config";
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import BottomTabs, { bottomTabIcons } from '../components/home/BottomTabs'

const HomeScreen = ({navigation}) => {
  const {userInfo} = useContext(AuthContext)
  const [allPosts, setAllPost] = useState([])

  axios({
    method: 'get',
    headers: {Authorization: `${userInfo.access_token}`},
    url: `${BASE_URL}/posts`,
  }).then((response) => {
    let allpost = response.data.posts
    setAllPost(allpost)
  });

  
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation}/>
      <Stories navigation={navigation}/>
      <ScrollView>
      {allPosts.map((post, index) => (
        <Posts post={post} key={index} navigation={navigation} userInfo={userInfo}/>
      ))}
      </ScrollView>
      <BottomTabs icons={bottomTabIcons} navigation={navigation} userInfo={userInfo}/>
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
})
export default HomeScreen