import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Alert, ActivityIndicator, FlatList, Modal, Pressable } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import api from '../components/api/api'; // Ensure the API file exists and has the correct endpoint
import FeedContainer from '../components/FeedCon';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUpload, faEye } from '@fortawesome/free-solid-svg-icons';

function ProfileView({ route, navigation }) {
  const [token, setToken] = useState('');
  const [feed, setFeed] = useState([]);
  const [data, setData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailsHeight, setDetailsHeight] = useState(new Animated.Value(0));
  const [showIcon, setShowIcon] = useState(false);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100'); // Initial profile image URL
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null); // Added state for notification
  const [optionsVisible, setOptionsVisible] = useState(false); // State for options visibility
  const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [uploading, setUploading] = useState(false);
  const [job, setJob] = useState('');

  const { alumniid } = route.params;

  // console.log("alumniid", alumniid);

  useEffect(() => {
    async function getToken() {
      const token = await SecureStore.getItemAsync('token');
      setToken(token);
    }
    getToken();
  }, []);

  useEffect(() => {
    // Fetch profile information from the server
    api.get(`/getAlumniInfo/${alumniid}`)
      .then(response => {
        setData(response.data);
        if (response.data && response.data[0] && response.data[0].photourl) {
          setProfileImage(response.data[0].photourl);
        }
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.log("ERROR IN GETTING PROFILE");
        console.error(error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  useEffect(() => {
    // Fetch job information from the server
    api.get(`/getJobInfo/${alumniid}`)
      .then(response => {
        // console.log("JOBINFO", response);
        setJob(response.data[0].presentoccupation);
      })
      .catch(error => {
        console.log("ERROR IN GETTING JOB PROFILE");
        console.error(error);
      });
  }, []);

  useEffect(() => {
    api.get(`/getMyFeed/${alumniid}`)
      .then(response => {
        setFeed(response.data);
      })
      .catch(error => {
        console.log("Error fetching feed with api:", error);
        handleLogout();
      });
  }, [notification]);

  const toggleExpand = () => {
    const targetHeight = isExpanded ? 0 : 150; // Adjust height as needed
    Animated.timing(detailsHeight, {
      toValue: targetHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri } = result.assets[0]; // Access the URI from the first asset
      setProfileImage(uri);
      setUploading(true);
      setOptionsVisible(false);
  
      const formData = new FormData();
      formData.append('photo', {
        uri: uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
  
      try {
        const response = await api.post('/uploadProfilePicture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
          setNotification('Profile photo updated successfully');
          setUploading(false);
        } else {
          setNotification('Failed to update profile photo');
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
        setNotification('Failed to update profile photo');
      }
    } else {
      console.error('No image selected or image URI is undefined.');
    }
  };

  const viewImage = () => {
    setModalVisible(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1c1c1e" />
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Failed to load profile information</Text>
      </View>
    );
  }

  const handleDeleteFeed = async (feedid) => {
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

  // console.log(data);

  return (
    <View style={styles.container}>
      <View style={{padding: 15}}>
      <View style={styles.profileHeader}>
        <TouchableOpacity
          onPress={() => setOptionsVisible(viewImage)}
          onPressIn={() => setShowIcon(true)}
          onPressOut={() => setShowIcon(false)}
        >
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
            {uploading && (
              <View style={styles.indicatorWrapper}>
                <ActivityIndicator size="large" color="#1c1c1e" />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{data[0].name}</Text>
          <Text style={styles.profileJob}>{job ? job : 'Occupation is Not Available'}</Text>
          <Text style={styles.profileJob}>Class {data[0].graduationyear}</Text>
        </View>
      </View>
      {/* {optionsVisible && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={viewImage}>
            <FontAwesomeIcon icon={faEye} />
            <Text style={styles.optionText}>View Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
            <FontAwesomeIcon icon={faUpload} />
            <Text style={styles.optionText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>
      )} */}
      <TouchableOpacity style={styles.expandButton} onPress={toggleExpand}>
        <Text style={styles.expandButtonText}>{isExpanded ? 'Hide' : 'See More'}</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.detailsContainer, { height: detailsHeight }]}>
        <View style={styles.detailItem}>
          <FontAwesome name="home" size={20} color="#333" style={styles.icon} />
          <Text style={styles.detailsText}>{data[0].address}</Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome name="envelope" size={20} color="#333" style={styles.icon} />
          <Text style={styles.detailsText}>{data[0].email}</Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome name="birthday-cake" size={20} color="#333" style={styles.icon} />
          <Text style={styles.detailsText}>{formatDate(data[0].birthday)}</Text>
        </View>
      </Animated.View>
      </View>
      <FlatList
        data={feed}
        renderItem={renderItem}
        keyExtractor={item => item.feedid.toString()}
        ListEmptyComponent={<Text style={styles.noPostsText}>No Post Available</Text>}
      />
      {isModalVisible && (
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
            <Text style={{marginBottom: 10, color: 'white'}}>Tap to Close</Text>
            <Pressable style={styles.modalContent}>
              <Image
                source={{ uri: profileImage }}
                style={styles.modalImage}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: '#fff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  indicatorWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 20,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileJob: {
    fontSize: 16,
    color: '#777',
  },
  optionsContainer: {
    marginTop: 10,
    position: 'absolute',
    top: 95,
    left: 15,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    elevation: 5,
    backgroundColor: 'white',
    zIndex: 999,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  expandButton: {
    marginVertical: 10,
    alignItems: 'center',
  },
  expandButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
  detailsContainer: {
    overflow: 'hidden',
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
  detailsText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  noPostsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    // backgroundColor: '#fff',
    // padding: 20,
    // borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    width: 400,
    height: 400,
    // borderRadius: 10,
  },
});

export default ProfileView;
