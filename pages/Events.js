import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import EventCard from '../components/EventCard';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarAlt, faCalendarCheck, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import api from '../components/api/api';

const Events = ({ navigation, handleTabPress }) => {
  const [token, setToken] = useState(null);
  const [get, setGet] = useState('all');
  const [events, setEvents] = useState([]);
  const [notification, setNotification] = useState(null);
  const [happeningEvents, setHappeningEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    async function getToken() {
      const token = await SecureStore.getItemAsync('token');
      setToken(token);
    }
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    setLoading(true); // Set loading to true when starting to fetch data
    api.get('/getEvents')
      .then(response => {
        setEvents(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(error => {
        console.error("Error fetching events:", error);
        setLoading(false); // Set loading to false on error
        // Handle logout
      });
  }, [notification]);

  useEffect(() => {
    setLoading(true); // Set loading to true when starting to fetch data
    api.get('/getFutureEvents')
      .then(response => {
        setFutureEvents(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(error => {
        console.error("Error fetching events:", error);
        setLoading(false); // Set loading to false on error
        // Handle logout
      });
  }, [notification]);

  useEffect(() => {
    setLoading(true); // Set loading to true when starting to fetch data
    api.get('/getPastEvents')
      .then(response => {
        setPastEvents(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(error => {
        console.error("Error fetching events:", error);
        setLoading(false); // Set loading to false on error
        // Handle logout
      });
  }, [notification]);

  useEffect(() => {
    setLoading(true); // Set loading to true when starting to fetch data
    api.get('/getHappeningEvents')
      .then(response => {
        setHappeningEvents(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(error => {
        console.error("Error fetching events:", error);
        setLoading(false); // Set loading to false on error
        // Handle logout
      });
  }, [notification]);

  const getEvent = (toget) => {
    setGet(toget);
  };

  const renderEvents = (events) => (
    events.map((event) => (
      <EventCard
        eventid={event.eventid}
        key={event.eventid}
        title={event.title}
        description={event.description}
        date={event.date}
        time={event.time}
        endtime ={event.endtime}
        location={event.location}
        capacity={event.capacity}
        registrationdeadline={event.registrationdeadline}
        accessing={"alumni"}
      />
    ))
  );

  return (
    <LinearGradient
      colors={['rgb(255, 226, 226)', 'rgb(166, 213, 255)', '#192f6a']}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.linearGradient}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.sidebar}>
            <TouchableOpacity 
              style={[styles.sidebarItem, get === "all" && styles.activeSidebarItem]} 
              onPress={() => getEvent("all")}>
              <FontAwesomeIcon icon={faCalendarDay} size={20} />
              <Text style={styles.sidebarText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sidebarItem, get === "happening" && styles.activeSidebarItem]} 
              onPress={() => getEvent("happening")}>
              <FontAwesomeIcon icon={faCalendarDay} size={20} />
              <Text style={styles.sidebarText}>Happening Now</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sidebarItem, get === "future" && styles.activeSidebarItem]} 
              onPress={() => getEvent("future")}>
              <FontAwesomeIcon icon={faCalendarAlt} size={20} />
              <Text style={styles.sidebarText}>Upcoming</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sidebarItem, get === "past" && styles.activeSidebarItem]} 
              onPress={() => getEvent("past")}>
              <FontAwesomeIcon icon={faCalendarCheck} size={20} />
              <Text style={styles.sidebarText}>Past</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mainContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#1c1c1e" style={styles.loader} />
            ) : (
              get === 'all' ? (events.length > 0 ? renderEvents(events) : <Text style={styles.noEventsText}>No events found</Text>) 
                : get === 'past' ? (pastEvents.length > 0 ? renderEvents(pastEvents) : <Text style={styles.noEventsText}>No past events</Text>) 
                : get === 'future' ? (futureEvents.length > 0 ? renderEvents(futureEvents) : <Text style={styles.noEventsText}>No upcoming events</Text>) 
                : get === 'happening' ? (happeningEvents.length > 0 ? renderEvents(happeningEvents) : <Text style={styles.noEventsText}>No happening events</Text>) 
                : <Text style={styles.noEventsText}>No events found</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flexDirection: 'column',
    paddingTop: 16,
  },
  sidebar: {
    flexDirection: "column",
    padding: 12,
    justifyContent: "space-evenly"
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginVertical: 2,
  },
  activeSidebarItem: {
    backgroundColor: '#8e979e',
  },
  sidebarText: {
    fontSize: 16,
    marginLeft: 8,
    color: 'black',
  },
  mainContent: {
  },
  noEventsText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    opacity: 0.5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Events;
