import { View, Text, TextInput, StyleSheet, Pressable, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Validator, validate } from 'email-validator'
import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { BASE_URL } from '../../config'
import Spinner from 'react-native-loading-spinner-overlay'

const SignupForm = ({navigation}) => {
  const [fullname, setFullname] = useState(null)
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [gender, setGender] = useState(null)
  const {isLoading, register} = useContext(AuthContext)

  const SignupFormSchema = Yup.object().shape({
    email: Yup.string().email().required('An email is required'),
    username: Yup.string().required().min(2,'A username is required'),
    password: Yup.string()
      .required()
      .min(8, 'Your password has to have at least 8 characters')
  })

  const getRandomProfilePicture = async () => {
    const response = await fetch('https://randomuser.me/api')
    const data = await response.json()
    return data.results[0].picture.large
  }
  return (
    <View style={styles.wrapper}>
      <Spinner visible={isLoading} />
      <Formik
      initialValues={{email: '', username: '', password: '', fullname: '', gender:''}}
      onSubmit={values => {
        register(values.fullname, values.username, values.email, values.password, values.gender )
      }}
      validationSchema={SignupFormSchema}
      validateOnMount={true}
      >
      {({ handleChange, handleBlur, handleSubmit, values, isValid}) => (
        <>
          <View style={[
              styles.inputField,
              {
                borderColor: 
                values.fullname.length < 1 || values.fullname.length > 1 ? '#ccc' : 'red',
              }
              ]}>
              <TextInput 
                placeholderTextColor='#444'
                placeholder='Fullname'
                autoCapitalize='none'
                keyboardType='fullname'
                textContentType='fullname'
                
                autoFocus={true}
                onChangeText={handleChange('fullname')}
                onBlur={handleBlur('fullname')}
                value={values.fullname}
              />
          </View>
          <View style={[
            styles.inputField,
            {
              borderColor: 
              values.username.length < 1 || values.username.length > 1 ? '#ccc' : 'red',
            }
            ]}>
            <TextInput 
              placeholderTextColor='#444'
              placeholder='Username'
              autoCapitalize='none'
              textContentType='username'
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
            />
          </View>
          <View style={[
            styles.inputField,
            {
              borderColor: 
              values.email.length < 1 || validate(values.email) ? '#ccc' : 'red',
            }
            ]}>
            <TextInput 
              placeholderTextColor='#444'
              placeholder='Phone number, username or email'
              autoCapitalize='none'
              keyboardType='email-address'
              textContentType='emailAddress'
              
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
          </View>
          <View style={[
            styles.inputField,
            {
              borderColor: 
              values.password.length < 1 || values.password.length > 5 ? '#ccc' : 'red',
            }
            ]}>
            <TextInput 
              placeholderTextColor='#444'
              placeholder='Password'
              autoCapitalize={false}
              secureTextEntry={true}
              textContentType='password'
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
          </View>
          <View style={[
            styles.inputField,
            {
              borderColor: 
              values.gender.length < 1 || values.gender.length > 1 ? '#ccc' : 'red',
            }
            ]}>
            <TextInput 
              placeholderTextColor='#444'
              placeholder='Gender'
              autoCapitalize={false}
              textContentType='gender'
              onChangeText={handleChange('gender')}
              onBlur={handleBlur('gender')}
              value={values.gender}
            />
          </View>
          <Pressable 
            titleSize={20} 
            style={styles.button(isValid)} 
            onPress={handleSubmit}
            disabled={!isValid}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
          <View style={styles.sigupContainer}>
            <Text>Already an account?</Text>
            <TouchableOpacity onPress={()=> navigation.goBack()}>
              <Text style={{color: '#6BB0F5'}}> Log in</Text>
            </TouchableOpacity>
          </View>
        </>
        )}
      </Formik>
    </View>
  )
}


const styles = StyleSheet.create({
  wrapper: {
    marginTop: 80,
  },

  inputField: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#FAFAFA',
    marginBottom: 10,
    borderWidth: 1,
  },

  button: (isValid) => ({
    backgroundColor: isValid ? '#0096F6' : '#9ACAF7',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    borderRadius: 4,
  }),

  buttonText: {
    fontWeight: '600',
    color: '#FFF',
    fontSize: 20,

  },

  sigupContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginTop: 50,
  }
})

export default SignupForm