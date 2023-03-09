import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';
import {Alert, Linking, Platform} from 'react-native';

const AppRating = () => {
  const [adsRead, setAdsRead] = useState([]);
  const [installDate, setInstallDate] = useState('');
  const [remindMeDate, setRemindMeDate] = useState('');

  useEffect(() => {
    // Load the user's data from local storage or API
    const loadData = async () => {
      const adsReadData = await AsyncStorage.getItem('adsRead');
      if (adsReadData) {
        setAdsRead(JSON.parse(adsReadData));
      }

      const installDateData = await AsyncStorage.getItem('installDate');
      if (installDateData) {
        setInstallDate(installDateData);
      }

      const remindMeDateData = await AsyncStorage.getItem('remindMeDate');
      if (remindMeDateData) {
        setRemindMeDate(remindMeDateData);
      }
    };

    loadData();
  }, []);

  const handleRateApp = () => {
    const storeUrl = Platform.OS === 'ios' ? 'APP_STORE_URL' : 'PLAY_STORE_URL';
    Linking.openURL(storeUrl);
  };

  const handleRemindMeLater = () => {
    // Set the remind me date to 4 weeks from now
    const currentDate = new Date();
    const remindMeDate = new Date(
      currentDate.getTime() + 4 * 7 * 24 * 60 * 60 * 1000
    );
    setRemindMeDate(remindMeDate.toISOString());
    AsyncStorage.setItem('remindMeDate', remindMeDate.toISOString());
  };

  const handleNoThanks = () => {
    // Do nothing
  };

  const handleYesPlease = () => {
    Alert.alert(
      'Rate Our App',
      'Are you enjoying our app? Please rate us!',
      [
        {
          text: 'No Thanks',
          onPress: handleNoThanks,
          style: 'cancel',
        },
        {
          text: 'Remind Me Later',
          onPress: handleRemindMeLater,
        },
        {
          text: 'Yes, Please!',
          onPress: handleRateApp,
        },
      ],
      {cancelable: false}
    );
  };

  const canShowRatingDialog = () => {
    // Check if the user has read at least 3 articles
    if (adsRead.length < 3) {
      return false;
    }

    // Check if the app was installed at least 7 days ago
    const installDateObj = new Date(installDate);
    const currentDate = new Date();
    const daysSinceInstall = Math.round(
      (currentDate - installDateObj) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceInstall < 7) {
      return false;
    }

    // Check if remind me date has passed
    if (remindMeDate) {
      const remindMeDateObj = new Date(remindMeDate);
      const daysSinceRemindMe = Math.round(
        (currentDate - remindMeDateObj) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceRemindMe < 28) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    if (canShowRatingDialog()) {
      handleYesPlease();
    }
  }, []);

  return null;
};

export default AppRating;
