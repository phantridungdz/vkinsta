import { View, TextInput, Text, Image , Button, TouchableOpacity, Platform, Alert} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import * as Yup from 'yup'
import { Formik, formik } from 'formik'
import { Divider } from 'react-native-elements'
import validUrl from 'valid-url'
// import * as ImagePicker from 'expo-image-picker'

import ImagePicker from 'react-native-image-crop-picker';
import { AuthContext } from '../../context/AuthContext'
import { BASE_URL } from '../../config'
import axios from 'axios'

const PLACEHOLDER_IMG = 'https://cp.cuyahogacounty.us/Images/Placeholder-Image-Square.png'

const uploadPostSchema = Yup.object().shape({
  imageUrl: Yup.string().url().required('A URL is required'),
  caption: Yup.string().max(2200, 'Caption has reached')
})

const FormikPostUploader = ({ navigation, onShowPopup}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(PLACEHOLDER_IMG)
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null)
  const {userInfo} = useContext(AuthContext)
  const [image, setImage] = useState(null)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [transferred, setTransferred] = useState(0)

  const pickImage = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(result => {
      const imageUri = Platform.OS === 'ios' ? result.path : result.uri
      setImage(imageUri)
      let file = { uri: result.path, type: "image", name: result.filename }
      setFile(file)
    });

  }

  const submitPost = async (caption) => {
    const uploadUri = image
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', 'upload_image')
    data.append('cloud_name', 'ddnv4r9pb')
    // data.append('api_key', 'OA-GG3RuBpzUphm64O4mZfRqNmY')
    fetch("https://api.cloudinary.com/v1_1/ddnv4r9pb/image/upload", {
      method: 'post',
      body: data,
      header: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    }).then(res =>
      res.json()
    ).then(data => {
      console.log(data)
      axios.post(
        `${BASE_URL}/posts`,{
          'content': caption,
          'images': {url: data.secure_url, public_id: data.public_id}
        },
        {
          headers: {Authorization: `${userInfo.access_token}`},
        },
      ).then(res => {
        console.log(res.data)
      }).catch(e =>{
        console.log(`logout error ${e}`)
      })
    })
  }

  return (
    <Formik
      initialValues={{caption: '', imageUrl: ''}}
      onSubmit={values => {
        submitPost(values.imageUrl, values.caption)
      }}
      validationSchema={uploadPostSchema}
      validateOnMount={true}
    >
      {({ 
        handleBlur, 
        handleChange, 
        handleSubmit,
        values, 
        errors, 
        isValid
      }) =>
        <>
          <View style={{ margin: 20, }}>
            
            <TouchableOpacity onPress={pickImage }>
              <View style={{ alignItems: 'center', flexDirection: 'column'}}>
                <Image 
                  source={{ uri: image ? image : 'https://cdn3.iconfinder.com/data/icons/photo-tools/65/select-512.png' }} 
                  style={{ width: 300, height:300, backgroundColor: 'white' }}
                />
              </View>
              
            </TouchableOpacity>
            <View style={{ marginLeft: 12}}>
              <TextInput 
                style={{color: 'white', fontSize: 20}}
                placeholder='Write a caption' 
                placeholderTextColor='gray'
                multiline={true}
                onChangeText={handleChange('caption')}
                onBlur={handleBlur('caption')}
                value={values.caption}
              />
            </View>
          </View>
          <Divider width={0.2} orientation='vertical'/>
          <TouchableOpacity style={{  alignItems: 'center'}} onPress={() =>
          submitPost(values.caption)
          // onShowPopup()
          }>
              <View style={{ borderWidth: 1, borderColor: 'white', marginTop: 15, borderRadius: 5, backgroundColor: '#1698f5'}}>
                <Text style={{color: 'white', padding: 10, paddingLeft: 20, paddingRight: 20, fontWeight: '600'}}>Share Post</Text>
              </View>
              
          </TouchableOpacity>
        </>
      }
    </Formik>
  )
}

export default FormikPostUploader