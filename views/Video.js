import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import {Video} from 'expo-av';
import React from 'react';

const MyVideo = () => {
  const secondVideo = React.useRef(null);

  return (
    <View style={styles.container}>
      <Video
        ref={secondVideo}
        style={styles.video}
        source={require('../img/videoa_edit.mp4')}
        useNativeControls
        resizeMode="contain"
        shouldPlay
        isLooping
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: 300,
    height: 300,
    alignSelf: 'stretch',
  },
  buttons: {
    margin: 16,
  },
});

export default MyVideo;
