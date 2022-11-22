import { View, Text, StyleSheet, TouchableOpacity, Image, Button } from 'react-native'
import React, { useContext } from 'react'
import Spinner from 'react-native-loading-spinner-overlay'
import { AuthContext } from '../../context/AuthContext'

const Header = ({navigation}) => {
  const {userInfo, logout, isLoading} = useContext(AuthContext)
  return (
    
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      {/* <Text style={{color: 'white'}}>{userInfo.access_token}</Text> */}

      <TouchableOpacity onPress={logout}>
        <Image 
          style={styles.logo}
          source={require('../../images/header-logo.png')}
        />
      </TouchableOpacity>

      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('NewPostScreen')}>
          <Image 
            style={styles.icon}
            source={{ uri: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/plus-2-math.png' }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image 
            style={styles.icon}
            source={{ uri: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/like--v1.png' }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', {
          userInfo: userInfo,
        })}>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>1</Text>
          </View>
          <Image 
            style={styles.icon}
            source={{ uri: 'https://img.icons8.com/fluency-systems-regular/60/ffffff/facebook-messenger.png' }}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  iconsContainer: {
    flexDirection: 'row',
  },  
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    resizeMode: 'contain'
  },

  unreadBadge: {
    backgroundColor: '#FF3250',
    position: 'absolute',
    left: 20,
    bottom: 18,
    width: 25,
    height: 18,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  unreadBadgeText: {
    color: 'white',
    fontWeight: '600',

  },
})

export default Header