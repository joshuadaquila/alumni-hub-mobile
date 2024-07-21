import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import MessageCard from '../components/MessageCard';
import * as SecureStore from 'expo-secure-store';
import api from '../components/api/api';

function Message() {
  const [token, setToken] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    async function getToken() {
      const token = await SecureStore.getItemAsync('token');
      setToken(token);
    }
    getToken();
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/getMessages')
      .then(response => {
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
        setMessages([response.data, ...messages]);
        setNewMessage('');
      })
      .catch(error => {
        console.log("ERROR in AXIOS POST");
        console.error(error);
        Alert.alert('Error', 'Failed to send message');
      });
  };

  const renderMessage = ({ item }) => (
    <MessageCard
      key={item.messageid ? item.messageid.toString() : 'default_key'}
      username={item.name} // Use 'name' from backend
      usertype={item.email} // Use 'email' from backend
      date={moment(item.date).format('YYYY-MM-DD HH:mm')}
      content={item.content}
    />
  );

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
          onChangeText={setNewMessage}
        />
        <Button title="Send" onPress={handleSendMessage} />
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
