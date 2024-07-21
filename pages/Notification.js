import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import NotificationCon from '../components/NotificationCon';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import moment from 'moment';
import api from '../components/api/api';

function Notification() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    async function getToken() {
      const token = await SecureStore.getItemAsync('token');
      setToken(token);
    }
    getToken();
  }, []);

  useEffect(() => {
    setLoading(true); // Set loading to true when starting to fetch data
    api.get(`/getNotifications`)
      .then(response => {
        console.log("NOTIF FETCH OK");
        setNotifications(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(error => {
        console.error(error);
        setLoading(false); // Set loading to false on error
      });
  }, [userId]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#1c1c1e" style={styles.loader} />
        ) : (
          notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationCon
                key={notification.notificationid}
                message={notification.message}
                type={notification.type}
                sentdate={moment(notification.sentdate).format('YYYY-MM-DD HH:mm')}
              />
            ))
          ) : (
            <Text style={styles.noNotificationsText}>No Notifications</Text>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noNotificationsText: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 18,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Notification;
