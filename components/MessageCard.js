import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisH, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const profileImg = require('../resources/profilepictemp.jpg');

function MessageCard({ id, username, usertype, date, content, accessing }) {
  const [hidden, setHidden] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [errors, setErrors] = useState([]);

  const optionsClicked = () => {
    setShowOptions(!showOptions);
  };

  useEffect(() => {
    const msgId = id; // replace with the actual message ID
    axios.get(`http://localhost:3001/checkMessage?messageid=${msgId}`)
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

  const hideMessage = async () => {
    try {
      await axios.post('http://localhost:3001/hideMessage', {
        messageid: id
      }, { withCredentials: true });
      setShowOptions(false);
    } catch (error) {
      setErrors([...errors, error.response?.status || "Unknown error"]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Image source={profileImg} style={styles.profileImage} />
          <View style={styles.textContainer}>
            <Text style={styles.username}>{username}</Text>
            {accessing === "user" && (
              <TouchableOpacity onPress={optionsClicked}>
                <FontAwesomeIcon icon={faEllipsisH} style={styles.optionsIcon} size={24} />
              </TouchableOpacity>
            )}
            <Text style={styles.usertype}>{usertype}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 165, 0, 0.2)', // Same as bg-orange-300 bg-opacity-20
    borderRadius: 8,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 8,
    elevation: 2,
    padding: 16,
    marginBottom: 8,
    position: 'relative',
  },
  innerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 8,
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  optionsIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    opacity: 0.5,
  },
  hiddenIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  usertype: {
    opacity: 0.8,
    fontSize: 14,
  },
  date: {
    opacity: 0.8,
    fontSize: 14,
  },
  contentContainer: {
    flexDirection: 'column',
  },
  contentText: {
    fontSize: 14,
  },
});

export default MessageCard;
