import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import * as SecureStore from 'expo-secure-store'; // Ensure you import SecureStore
import api from './api/api';

// Placeholder image
const placeholderImg = require('../resources/profilepictemp.jpg');

function MessageCard({ id, username, usertype, date, content, accessing, photourl }) {
  const [uName, setUname] = useState();
  const [hidden, setHidden] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const optionsClicked = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    async function getToken() {
      const uname = await SecureStore.getItemAsync('uName');
      setUname(uname);
    }
    getToken();
  }, []);

  useEffect(() => {
    const msgId = id; // replace with the actual message ID
    api.get(`/checkMessage?messageid=${msgId}`)
      .then(response => {
        if (response.data[0].status === "active") {
          setHidden(false);
        } else {
          setHidden(true);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [showOptions]);

  const isOwnMessage = uName === username;
  const imageSource = photourl ? { uri: photourl } : placeholderImg;

  return (
    <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
      {isOwnMessage ? (
        <>
          <View style={styles.bubbleContainer}>
            <Text style={styles.username}>{username}</Text>
            <View style={styles.contentContainer}>
              <Text style={styles.contentText}>{content}</Text>
            </View>
            <View style={styles.footerContainer}>
              {accessing === "user" && (
                <TouchableOpacity onPress={optionsClicked}>
                  <FontAwesomeIcon icon={faEllipsisH} style={styles.optionsIcon} size={24} />
                </TouchableOpacity>
              )}
              <Text style={styles.date}>{date}</Text>
            </View>
          </View>
          <Image source={imageSource} style={styles.profileImage} />
        </>
      ) : (
        <>
          <Image source={imageSource} style={styles.profileImage} />
          <View style={styles.bubbleContainer}>
            <Text style={styles.username}>{username}</Text>
            <View style={styles.contentContainer}>
              <Text style={styles.contentText}>{content}</Text>
            </View>
            <View style={styles.footerContainer}>
              {accessing === "user" && (
                <TouchableOpacity onPress={optionsClicked}>
                  <FontAwesomeIcon icon={faEllipsisH} style={styles.optionsIcon} size={24} />
                </TouchableOpacity>
              )}
              <Text style={styles.date}>{date}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // marginBottom: 8,
  },
  ownMessage: {
    justifyContent: 'flex-end', // Aligns the bubble and profile image to the right for own messages
  },
  otherMessage: {
    justifyContent: 'flex-start', // Aligns the bubble and profile image to the left for others' messages
  },
  bubbleContainer: {
    borderRadius: 8,
    padding: 4,
    maxWidth: '75%', // Adjust based on design needs
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
  },
  contentText: {
    fontSize: 14,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  optionsIcon: {
    opacity: 0.5,
  },
  date: {
    opacity: 0.8,
    fontSize: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // marginHorizontal: 8, // Space between image and bubble
  },
});

export default MessageCard;
