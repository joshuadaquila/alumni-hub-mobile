import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TextInput, Button, Alert, Image, TouchableOpacity, Animated, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import api from '../components/api/api';
import { storage } from '../components/api/firebase';  // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';  // Firebase storage functions
import FeedContainer from '../components/FeedCon';  // Import FeedContainer
import io from 'socket.io-client';

function Home({ navigation, handleLogout, handleTabPress }) {
  const [profilepicurl, setProfilePicUrl] = useState('https://via.placeholder.com/50');
  const [token, setToken] = useState('');
  const [feed, setFeed] = useState([]);
  const [notification, setNotification] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [containerHeight, setContainerHeight] = useState(new Animated.Value(0));
  const [containerOpacity, setContainerOpacity] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true); // Added loading state
  const [socket, setSocket] = useState(null);
  const [isPosting, setPosting] = useState(false);

  const SOCKET_URL = 'https://ua-alumhi-hub-be.onrender.com'; // Replace with your server URL

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    async function getToken() {
      const token = await SecureStore.getItemAsync('token');
      setToken(token);
    }
    getToken();
  }, []);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      query: { token }
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('messageNotification', (message) => {
      // console.log('Received message via socket:', message);
      // Ensure message has all necessary fields before adding
      if (message && message.messageid && message.name && message.email && message.photourl && message.content && message.date) {
        setMessages(prevMessages => [message, ...prevMessages]);
      } else {
        console.error('Invalid message format:', message);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    // Fetch profile information from the server
    const fetchProfileInfo = async () => {
      try {
        const response = await api.get('/getAlumniInfo');
        if (response.data && response.data[0] && response.data[0].photourl) {
          setProfilePicUrl(response.data[0].photourl);
        }
      } catch (error) {
        console.log("ERROR IN GETTING PROFILE");
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after fetching profile info
      }
    };

    fetchProfileInfo();
  }, []);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await api.get('/getFeed');
        setFeed(response.data);
        // console.log("ALUMNIID", response.data[0].alumniid);
      } catch (error) {
        console.log("Error fetching feed with api:", error);
        handleLogout();
      }
    };

    fetchFeed();
  }, [notification]);

  const handleCreatePost = async () => {
    setPosting(true);
    if (newPost.trim() === '') {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }
  
    const uploadImagePromises = selectedImages.map(async (image, index) => {
      try {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `images/${Date.now()}_${index}.jpg`);
        const uploadTask = uploadBytesResumable(storageRef, blob);
  
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => {
              console.error('Upload failed', error);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              } catch (urlError) {
                console.error('Getting download URL failed', urlError);
                reject(urlError);
              }
            }
          );
        });
      } catch (conversionError) {
        console.error('Image conversion failed', conversionError);
        throw conversionError;
      }
    });
  
    try {
      const imageUrls = await Promise.all(uploadImagePromises);
  
      const formData = new FormData();
      formData.append('content', newPost);
      selectedImages.forEach((image, index) => {
        formData.append('images', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
        });
      });
  
      api.post('createPost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          socket.emit('feedNotification', response.data);
          Alert.alert('Success', 'Post created successfully.');
          setNewPost('');
          setPosting(false);
          setSelectedImages([]);
          setNotification(response.data);
          toggleCollapse(); // Collapse the container after posting
        })
        .catch(postError => {
          console.log('Error creating post:', postError);
          Alert.alert('Error', 'Failed to create post.');
        });
    } catch (uploadError) {
      console.error('Image upload failed', uploadError);
      Alert.alert('Error', 'Failed to upload images.');
    }
  };

  const handleSelectImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setSelectedImages([...selectedImages, result.assets[0]]);
      }
    } else {
      Alert.alert('Error', 'Permission denied to access media library.');
    }
  };

  const handleRemoveImage = (uri) => {
    setSelectedImages(selectedImages.filter(image => image.uri !== uri));
  };

  const toggleCollapse = () => {
    const targetHeight = isCollapsed ? 300 : 0; // Adjust the height as needed
    const targetOpacity = isCollapsed ? 1 : 0;

    Animated.parallel([
      Animated.timing(containerHeight, {
        toValue: targetHeight,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(containerOpacity, {
        toValue: targetOpacity,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();

    setIsCollapsed(!isCollapsed);
  };

  const handleDeleteFeed = async (feedid) => {
    console.log('Attempting to delete feed with ID:', feedid);
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              // Make a DELETE request to the API
              await api.delete(`/deletePost/${feedid}`);
              // Optionally, you can add additional code to handle successful deletion, like updating state or navigating away
              Alert.alert('Post deleted successfully');
              setFeed(feed.filter(item => item.feedid !== feedid));
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Failed to delete post. Please try again.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => {
    // console.log("item", item);
    return (
      <FeedContainer
        feedid={item.feedid}
        content={item.content}
        alumniid={item.alumniid}
        datestamp={item.datestamp}
        photourl={item.photourl}
        username={item.name}
        profilepicurl={item.profilepic}
        onDelete={handleDeleteFeed}
        navigation={navigation}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1c1c1e" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['white', 'white']}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.linearGradient}
    >
      <View style={styles.container}>
        <View style={styles.postHeader}>
          <Image
            source={{ uri: profilepicurl }}
            style={styles.profileImage}
          />
          <TouchableWithoutFeedback onPress={toggleCollapse}>
            <View style={styles.postToggleButton}>
              <FontAwesomeIcon icon={faPaperclip} style={styles.icon} />
              <Text style={styles.toggleButtonText}>
                {isCollapsed ? 'Write a Post' : 'Write a Post'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Animated.View style={[styles.postContainer, { height: containerHeight, opacity: containerOpacity }]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.postInput}
              placeholder="Engage with the community!"
              value={newPost}
              onChangeText={setNewPost}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity style={styles.addPhotoButton} onPress={handleSelectImage}>
              <Icon name="camera" size={18} color="#000" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
            <View style={styles.imagePreviewContainer}>
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.previewContainer}>
                  <Image source={{ uri: image.uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(image.uri)}
                  >
                    <Icon name="times" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity
              onPress={handleCreatePost}
              style={styles.button}
              disabled={isPosting}  // Disable the button when posting
            >
              {isPosting ? (
                <ActivityIndicator color={"white"} />
              ) : (
                <Text style={styles.buttonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
        <FlatList
          data={feed}
          renderItem={renderItem}
          keyExtractor={item => `feed-${item.feedid}`}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  postToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#e8ebe9",
    marginLeft: 15,
    padding: 15,
    borderRadius: 15,
  },
  button:{
    backgroundColor: '#7f1d1d',
    padding: 10,
    borderRadius: 25,
  },
  buttonText:{
    color: 'white',
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
    opacity: 0.5,
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#000',
    opacity: 0.5,
  },
  postContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e3e6e4',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inputContainer: {
    flex: 1,
    padding: 20,
  },
  postInput: {
    height: 80,
    borderColor: '#1c1c1e',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  addPhotoButton: {
    opacity: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10,
  },
  addPhotoText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#000',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 3,
  },
  previewContainer: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
    padding: 5,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
