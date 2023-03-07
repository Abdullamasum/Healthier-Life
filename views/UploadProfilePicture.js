import {Card} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Button} from '@rneui/base';
import {CardDivider} from '@rneui/base/dist/Card/Card.Divider';
import {
  Keyboard,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, {useContext, useState, useRef} from 'react';
import missingImage from '../img/missing.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Video} from 'expo-av';
import {userPictureTagPrefix} from '../utils/variables';
import {mainAppColor} from '../utils/colors';

const UploadProfilePicture = ({navigation}) => {
  const {postMediaWithTag} = useMedia();

  const {user, update, setUpdate} = useContext(MainContext);

  const [mediaFile, setMediaFile] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const video = useRef(null);

  const pickFile = async () => {
    try {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      console.log(result);

      if (!result.canceled) {
        console.log(
          'UploadProfilePicture, pickFile: File Picked: ' + result.assets[0]
        );
        setMediaFile(result.assets[0]);
      }
    } catch (error) {
      console.log('UploadProfilePicture, pickFile: ', error);
    }
  };

  const clearUpload = () => {
    setMediaFile({});
  };

  const uploadFile = async (data) => {
    setIsLoading(true);

    const userPictureTag = userPictureTagPrefix + user.user_id;

    const formData = new FormData();
    formData.append('title', userPictureTag);
    formData.append('description', 'User picture of user ' + user.user_id);

    const filename = mediaFile.uri.split('/').pop();

    let fileExt = filename.split('.').pop();
    if (fileExt === 'jpg') fileExt = 'jpeg';

    const mimeType = mediaFile.type + '/' + fileExt;

    formData.append('file', {
      uri: mediaFile.uri,
      name: filename,
      type: mimeType,
    });

    console.log(
      'UploadProfilePicture, uploadFile: Formdata Created: ' + formData
    );

    try {
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken === null) {
        throw new Error('No user token saved locally!');
      }

      const result = await postMediaWithTag(
        formData,
        userPictureTag,
        userToken
      );
      console.log('UploadProfilePicture, uploadFile: ' + result);

      Alert.alert('Upload Complete', 'Profile picture updated successfully!', [
        {
          text: 'Ok',
          onPress: () => {
            console.log('Ok Pressed, navigating to home screen...');
            setUpdate(!update);

            // Clear fields and file
            clearUpload();

            // Navigate to profile
            navigation.navigate('Profile');
          },
        },
      ]);
    } catch (error) {
      console.error('UploadProfilePicture, uploadFile: Upload failed!', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <Card>
          {mediaFile.type === 'video' ? (
            <Video
              ref={video}
              source={{uri: mediaFile.uri}}
              style={{width: '100%', height: 200}}
              useNativeControls
              resizeMode="contain"
              onError={(error) => {
                console.log('Single, Single: ' + error);
              }}
            />
          ) : (
            <Card.Image
              source={mediaFile.uri ? {uri: mediaFile.uri} : missingImage}
              onPress={pickFile}
            />
          )}

          <CardDivider />

          <Button title="Select File" color={mainAppColor} onPress={pickFile} />
        </Card>
        <Card>
          <Button
            disabled={!mediaFile.uri}
            title="Upload"
            color={mainAppColor}
            onPress={uploadFile}
          />
          {isLoading && <ActivityIndicator size="large" />}
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

UploadProfilePicture.propTypes = {
  navigation: PropTypes.object,
};

export default UploadProfilePicture;
