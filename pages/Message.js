import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';
import moment from 'moment';
import MessageCard from '../components/MessageCard';
import * as SecureStore from 'expo-secure-store';
import api from '../components/api/api';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const SOCKET_URL = 'https://ua-alumhi-hub-be.onrender.com'; // Replace with your server URL

function Message() {
  const [token, setToken] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

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
    setLoading(true);
    api.get('/getMessages')
      .then(response => {
        // console.log('Fetched messages:', response.data);
        setMessages(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log("ERROR in AXIOS FETCH");
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleSendMessage = () => {
    setSending(true);
    if (newMessage.trim() === '') {
      Alert.alert('Error', 'Message cannot be empty');
      return;
    }

    const messageData = {
      content: newMessage,
      // Add any other fields required by your API
    };

    api.post('/addUserMessage', messageData)
      .then(response => {

        // Send message to socket server with necessary fields
        setSending(false);
        socket.emit('messageNotification', response.data);
        sendNotification(messageData.content)
        setNewMessage('');
      })
      .catch(error => {
        console.log("ERROR in AXIOS POST");
        console.error(error);
        Alert.alert('Error', 'Failed to send message');
      })
  };

  const renderMessage = ({ item }) => (
    <MessageCard
      key={item.messageid ? item.messageid.toString() : 'default_key'}
      username={item.name} // Ensure 'name' is present
      usertype={item.email} // Ensure 'email' is present
      date={moment(item.date).format('YYYY-MM-DD HH:mm')}
      content={item.content}
      photourl={item.photourl} // Ensure 'photourl' is present
      id={item.messageid}
    />
  );

  const sendNotification = (title) => {
    const type = "message";
    const message = `New Message: ${title}`;

  
    // Send the notification to the backend to store it
    api.post('/addNotification', {
      title,
      message,
      type
    })
    .then(response => {
      console.log('Notification added successfully:', response.data);
    })
    .catch(error => {
      console.error('Error adding notification:', error);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.messagesContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#1c1c1e" style={styles.loader} />
        ) : messages.length === 0 ? (
          <Text style={styles.noMessagesText}>No Messages</Text>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.messageid ? item.messageid.toString() : 'default_key'}
          />
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          multiline={true}
          onChangeText={setNewMessage}
        />
        {/* <Button title="Send" onPress={handleSendMessage} /> */}
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendbtn} disabled={sending}>
          <FontAwesomeIcon icon={faPaperPlane} color='white'/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  sendbtn:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: '#1c1c1e',
    height: 40,
    width: 40,
    borderRadius: 2,
  },
  noMessagesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginRight: 8,
  },
});

export default Message;
