import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {
  appTag,
  favouritesUrl,
  loginUrl,
  mediaUrl,
  tagsUrl,
  usersUrl,
} from '../utils/variables';

// Send a fetch to the backend and return response in json format or throw an error
const doFetch = async (url, options) => {
  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    const message = json.error
      ? `${json.message}: ${json.error}`
      : json.message;

    throw new Error(message || `${response.status}: ${response.statusText}`);
  }

  return json;
};

const useMedia = (myFilesOnly) => {
  const [mediaArray, setMediaArray] = useState([]);
  const {update, user} = useContext(MainContext);
  const {getFilesByTag, postTag} = useTag();

  const loadMedia = async () => {
    try {
      let json = await getFilesByTag(appTag);
      if (myFilesOnly) {
        json = json.filter((file) => file.user_id === user.user_id);
      }
      json = json.reverse();

      // Get the extra data including the thumbnails for each file.
      const media = await Promise.all(
        json.map(async (file) => {
          const fileResponse = await fetch(mediaUrl + file.file_id);
          return await fileResponse.json();
        })
      );

      setMediaArray(media);
    } catch (error) {
      console.error('ApiHooks, loadMedia', error);
    }
  };

  // Send the fileData to the server to create a new post
  const postMedia = async (fileData, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
      body: fileData,
    };
    try {
      return await doFetch(mediaUrl, options);
    } catch (error) {
      throw new Error('ApiHooks, postMedia: ' + error.message);
    }
  };

  // Posts the file to the server and then a tag of the app to that post
  const postMediaWithAppTag = async (fileData, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
      body: fileData,
    };
    try {
      const result = await doFetch(mediaUrl, options);

      // Tag posting
      const tagData = {file_id: result.file_id, tag: appTag};
      const tagResult = await postTag(tagData, token);
      console.log('Apihooks, postMediaWithAppTag: ' + tagResult);

      // Return media post result
      return result;
    } catch (error) {
      throw new Error('ApiHooks, postMediaWithAppTag: ' + error.message);
    }
  };

  // Request a deletion of a file from the server
  const deleteMedia = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(mediaUrl + fileId, options);
    } catch (error) {
      throw new Error('ApiHooks, deleteMedia: ' + error.message);
    }
  };

  // Request a modification of a post from the server
  const putMedia = async (fileId, data, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };
    try {
      return await doFetch(mediaUrl + fileId, options);
    } catch (error) {
      throw new Error('ApiHooks, putMedia: ' + error.message);
    }
  };

  // Refresh mediaArray whenever update gets changed
  useEffect(() => {
    loadMedia();
  }, [update]);

  return {mediaArray, postMedia, postMediaWithAppTag, deleteMedia, putMedia};
};

const useAuthentication = () => {
  // Request a log in from the server. Token will be returned when successful
  const postLogin = async (userCredentials) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userCredentials),
    };
    try {
      return await doFetch(loginUrl, options);
    } catch (error) {
      throw new Error('ApiHooks, postLogin: ' + error.message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  // Request information about the current user
  const getUserByToken = async (token) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(usersUrl + 'user', options);
    } catch (error) {
      throw new Error('ApiHooks, getUserByToken: ' + error.message);
    }
  };

  // Create a new user with the given data
  const postUser = async (userData) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };
    try {
      return await doFetch(usersUrl, options);
    } catch (error) {
      throw new Error('ApiHooks, postUser: ' + error.message);
    }
  };

  // Returns the availability of the given username
  const checkUsername = async (username) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const result = await doFetch(usersUrl + 'username/' + username, options);
      return result.available;
    } catch (error) {
      throw new Error('ApiHooks, checkUser: ' + error.message);
    }
  };

  // Request changes to an existing user in the server
  const changeUser = async (data, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };
    try {
      return await doFetch(usersUrl, options);
    } catch (error) {
      throw new Error('ApiHooks, changeUser: ' + error.message);
    }
  };

  // Get a specific user's information
  const getUserById = async (id, token) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(usersUrl + id, options);
    } catch (error) {
      throw new Error('ApiHooks, getUserById: ' + error.message);
    }
  };

  return {getUserByToken, postUser, checkUsername, changeUser, getUserById};
};

const useTag = () => {
  // Get all the files with the given tag from the server. (from oldest first to newest last)
  const getFilesByTag = async (tag) => {
    try {
      return await doFetch(tagsUrl + tag);
    } catch (error) {
      throw new Error('ApiHooks, getFilesByTag: ' + error.message);
    }
  };

  // Request a tag to be made for a given post
  const postTag = async (data, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };
    try {
      return await doFetch(tagsUrl, options);
    } catch (error) {
      throw new Error('ApiHooks, postTag: ' + error.message);
    }
  };

  return {getFilesByTag, postTag};
};

const useFavourite = () => {
  // Add a given post to the user's favourites
  const postFavourite = async (fileId, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({file_id: fileId}),
    };
    try {
      return await doFetch(favouritesUrl, options);
    } catch (error) {
      throw new Error('ApiHooks, postFavourite: ' + error.message);
    }
  };

  // Request a list of favourites given to a file
  const getFavouritesByFileId = async (fileId) => {
    try {
      return await doFetch(favouritesUrl + 'file/' + fileId);
    } catch (error) {
      throw new Error('ApiHooks, getFavouritesByFileId: ' + error.message);
    }
  };

  const deleteFavourite = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    };
    try {
      return await doFetch(favouritesUrl + 'file/' + fileId, options);
    } catch (error) {
      throw new Error('ApiHooks, deleteFavourite: ' + error.message);
    }
  };

  return {
    postFavourite,
    getFavouritesByFileId,
    deleteFavourite,
  };
};

export {useMedia, useAuthentication, useUser, useTag, useFavourite};
