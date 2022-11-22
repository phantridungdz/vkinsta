import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import AddNewPost from '../components/newPost/AddNewPost'
import { BottomPopup } from '../components/popup/BottomPopup'

const popupList = [
  {
    id: 1,
    name: 'Take a picture'
  },
  {
    id: 2,
    name: 'Select From Library'
  }
]

const NewPostScreen = ({navigation}) => {
  let popupRef = React.createRef()
  const onShowPopup = () => {
    popupRef.show()
  }

  const onClosePopup = () => {
    popupRef.close()
  }
  return (
    <SafeAreaView style={{ backgroundColor: 'black', flex: 1}}>
      <AddNewPost navigation={navigation} />
      <TouchableOpacity  onPress={onShowPopup}>
        <Text style={{color: 'white'}}> Show Popup</Text>
      </TouchableOpacity>
      <BottomPopup 
        ref={(target) => popupRef = target}
        onTouchOutside={onClosePopup}
        title="Please Select this"
        data={popupList}
      />
    </SafeAreaView>
  )
}

export default NewPostScreen