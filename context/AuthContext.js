import React, {createContext, useState} from "react"
import { BASE_URL } from "../config";
import axios from 'axios'
import { AsyncStorage } from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const onLogin = async(email , password) => {
    setIsLoading(true)
    axios
    .post(`${BASE_URL}/login`, {
      email,
      password
    })
    .then(res => {
      let userInfo = res.data
      setUserInfo(userInfo)
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
      setIsLoading(false)
    })
    .catch(e => {
      console.log(`register error ${e}`)
      setIsLoading(false)
    })
  }

  const register = (fullname, username, email, password, gender) => {
    setIsLoading(true)
    axios
    .post(`${BASE_URL}/register`, {
      fullname,
      username,
      email,
      password,
      gender
    })
    .then(res => {
      let userInfo = res.data
      setUserInfo(userInfo)
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
    })
    .catch(e => {
      console.log(`register error ${e}`)
      setIsLoading(false)
    })
  }

  const logout = () => {
    setIsLoading(true)
    axios.post(
      `${BASE_URL}/logout`,{},
      {
        headers: {Authorization: `Bearer ${userInfo.access_token}`},
      },
    ).then(res => {
      console.log(res.data)
      AsyncStorage.removeItem('userInfo')
      setUserInfo({})
      setIsLoading(false)
    }).catch(e =>{
      console.log(`logout error ${e}`)
      setIsLoading(false)
    })
  }

  return (
    <AuthContext.Provider 
      value={{
        isLoading,
        userInfo,
        register,
        onLogin,
        logout
      }}>
      {children}
    </AuthContext.Provider>
  )
}