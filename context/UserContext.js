import React, {createContext, useState} from "react"
import { BASE_URL } from "../config";
import axios from 'axios'
import { AsyncStorage } from "react-native"

export const UserContext = createContext();

export const UserProvider = ({children}) => {
  const userData = () => {
    axios({
      method: 'get',
      url: `${BASE_URL}/user`,
    }).then((response) => {
      console.log(response.data);
    });
  }
  

  return (
    <UserContext.Provider 
      value={{
        userData,
      }}>
      {children}
    </UserContext.Provider>
  )
}