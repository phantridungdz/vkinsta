import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { BASE_URL } from "../../config";
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import {LinearGradient} from 'expo-linear-gradient'

const Stories = ({navigation}) => {
  const {userInfo} = useContext(AuthContext)
  const [allUsers, setAllUsers] = useState([])
  useEffect(() => {
    axios({
      method: 'get',
      headers: {Authorization: `${userInfo.access_token}`},
      url: `${BASE_URL}/user`,
    }).then((response) => {
      let allusers = response.data.users
      setAllUsers(allusers)
    });
  }, [])
  
  return (
    <View style={{ marginBottom: 13}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {allUsers.map((story, key) => {
          return(
          <TouchableOpacity key={key} onPress={() => navigation.navigate('ProfileScreen', {userInfo: story,
          user: story})}>
            <View   style={{alightItems: 'center', marginRight:5}}>
              <LinearGradient 
                colors={['#f5d905', '#f2291b', '#f505e9', '#a505f5', '#f50579', '#8000FF']}
                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                style={styles.grediant}
                >
                <Image source={{uri: story.avatar}} style={styles.storyStyle}/>
              </LinearGradient>
              <Text style={{ color: 'white', fontSize:11, alignSelf: 'center',}}>
              {story.username.length > 11 
              ? story.username.slice(0, 10).toLocaleLowerCase() + '...'
              : story.username.toLocaleLowerCase()}
              </Text>
            </View>
          </TouchableOpacity>
        )})}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  storyStyle: {
    width:  55,
    height: 55,
    borderRadius: 35,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: 'white'
  },
  grediant: {
    width:  60,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'center'
    ,borderRadius: 35
  },
})

export default Stories