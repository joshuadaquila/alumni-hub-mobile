import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, ActivityIndicator, FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import api from '../components/api/api'; // Ensure the API file exists and has the correct endpoint
import FeedContainer from '../components/FeedCon';

function Profile() {
  const [token, setToken] = useState('');
  const [feed, setFeed] = useState([]);
  const [data, setData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailsHeight, setDetailsHeight] = useState(new Animated.Value(0));
  const [showIcon, setShowIcon] = useState(false);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/100'); // Initial profile image URL
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null); // Added state for notification

  useEffect(() => {
    async function getToken() {
      const token = await SecureStore.getItemAsync('token');
      setToken(token);
    }
    getToken();
  }, []);

  useEffect(() => {
    // Fetch profile information from the server
    api.get('/getAlumniInfo')
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
    console.log("feed is fetching")
    api.get('/getMyFeed')
      .then(response => {
        console.log(response.data)
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

    if (!result.cancelled) {
      setProfileImage(result.uri);
      // You can also upload the selected image to the server here
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
      />
    );
  };

  console.log("feed", feed);
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity
          onPress={pickImage}
          onPressIn={() => setShowIcon(true)}
          onPressOut={() => setShowIcon(false)}
        >
          <Image 
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
          {showIcon && (
            <View style={styles.iconContainer}>
              <FontAwesome name="camera" size={24} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{data[0].name}</Text>
          <Text style={styles.profileJob}>Programmer, {data[0].graduationyear}</Text>
        </View>
      </View>
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

      <FlatList
          data={feed}
          renderItem={renderItem}
          keyExtractor={item => `feed-${item.feedid}`}
          contentContainerStyle={styles.flatListContent}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  iconContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileJob: {
    fontSize: 16,
    color: '#555',
  },
  expandButton: {
    padding: 10,
    backgroundColor: '#1c1c1e',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
  },
  expandButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  detailsContainer: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  detailsText: {
    fontSize: 16,
    color: '#333',
  },
  flatListContent: {
    flexGrow: 1,
  },
});

export default Profile;
