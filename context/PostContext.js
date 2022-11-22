import React, {createContext, useState, useContext, useEffect} from "react"
import { BASE_URL } from "../config";
import axios from 'axios'
import { AsyncStorage } from "@react-native-async-storage/async-storage";
import { AuthContext } from '../context/AuthContext'


export const PostContext = createContext();

export const PostProvider = ({children}) => {
  const {userInfo} = useContext(AuthContext)
  const [allPosts, setAllPost] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [postUser, setPostUser] = useState({})

  const allpost = () => {
    useEffect(() => {
      axios({
        method: 'get',
        headers: {Authorization: `${userInfo.access_token}`},
        url: `${BASE_URL}/posts`,
      }).then((response) => {
        let allpost = response.data.posts
      });
    }, [])
  }
  
  const postByUsername = (userInfo, user) => {
    useEffect(() => {
      axios({
        method: 'get',
        headers: {Authorization: `${userInfo.access_token}`},
        url: `${BASE_URL}/post/?username=${user.username}`,
        username: user.username
      }).then((response) => {
        setPostUser(response.data)
      });
    }, [])
  }
  

  return (
    <PostContext.Provider 
      value={{
        allpost,
        postByUsername,
        postUser
      }}>
      {children}
    </PostContext.Provider>
  )
}