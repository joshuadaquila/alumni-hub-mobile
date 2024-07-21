import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store'; 
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarCheck, faCalendarDay, faCalendarXmark, faCheck, faClock, faLocationPin, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import eventcover from "../resources/eventcover.jpg"; // Ensure this is a valid path
import axios from 'axios';
import api from './api/api';

function EventCard(props) {
  const { eventid, title, description, date, time, endtime, location, capacity, registrationdeadline, accessing } = props;

  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [token, setToken] = useState('');
  const [registered, setRegistered] = useState(false);

  // useEffect(() => {
  //   async function fetchToken() {
  //     const storedToken = await SecureStore.getItemAsync('token');
  //     setToken(storedToken);
  //   }
  //   fetchToken();
  // }, []);

  // useEffect(() => {
  //   if (token) {
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //   }
  // }, [token]);

  useEffect(() => {
    api.get(`/checkEvent?eventid=${eventid}`)
      .then(response => {
        setRegistered(response.data.length !== 0);
      })
      .catch(error => {
        console.error("Error fetching event status:", error);
      });
  }, [eventid]);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const year = dateObj.getFullYear();
    const day = dateObj.getDate();
    return `${month} ${day}, ${year}`;
  };

  const registerEvent = async () => {
    setLoading(true);
    try {
      const endpoint = registered ? '/cancelRegistration' : '/registerEvent';
      const response = await api.post(endpoint, { eventid: eventid });
      setRegistered(!registered);
    } catch (error) {
      console.error("Error registering/cancelling event:", error);
      setErrors([...errors, error.response?.status || "Unknown error"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Image source={eventcover} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <FontAwesomeIcon icon={faCalendarDay} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <FontAwesomeIcon icon={faUserCheck} />
              <Text>{capacity}</Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesomeIcon icon={faCalendarCheck} />
              <Text>{formatDate(date)}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <FontAwesomeIcon icon={faClock} />
              <Text>{time} - {endtime}</Text>
            </View>
            <View style={styles.detailItem}>
              <FontAwesomeIcon icon={faLocationPin} />
              <Text>{location}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <FontAwesomeIcon icon={faCalendarXmark} />
              <Text>{formatDate(registrationdeadline)}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.description}>{description}</Text>
        {accessing !== "user" && (
          <TouchableOpacity style={[styles.button, registered ? styles.registeredButton : styles.joinButton]} onPress={registerEvent} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <FontAwesomeIcon icon={registered ? faCheck : faStar} color='white' />
                <Text style={styles.buttonText}>{registered ? "REGISTERED" : "REGISTER"}</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
    margin: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    elevation: 2,
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: 150, // Set a fixed height or use a proportional value
  },
  infoContainer: {
    padding: 10,
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  detailsContainer: {
    marginTop: 10,
    width: "100%",
  },
  detailRow: {
    flexDirection: 'row',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    margin: 2,
    borderRadius: 5,
    width: "auto",
  },
  description: {
    marginTop: 10,
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  joinButton: {
    backgroundColor: '#1c1c1e',
  },
  registeredButton: {
    backgroundColor: '#228B22',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
  },
});

export default EventCard;
