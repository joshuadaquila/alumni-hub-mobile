import { faBars, faBell, faCalendar, faHome, faMessage, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import Events from '../pages/Events';
import Notification from '../pages/Notification';
import Message from '../pages/Message';
import Profile from '../pages/Profile';
import Sidebar from './Sidebar'; // Ensure you have this import
import { io } from 'socket.io-client';
import { LinearGradient } from 'expo-linear-gradient';
import api from './api/api';

const SOCKET_URL = 'https://ua-alumhi-hub-be.onrender.com'; // Replace with your server URL

const Header = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [token, setToken] = useState();
  const [socket, setSocket] = useState(null);
  const [newMessages, setNewMessages] = useState(false);
  const [newFeed, setNewFeed] = useState(false);
  const [newNotifications, setNewNotifications] = useState(false);
  const [newEvents, setNewEvents] = useState(false);
  const [tabRefresh, setTabRefresh] = useState({});

  const [unreadNotif, setUnreadNotif] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("checking notif");
    api.get('/checkNotification')
      .then(response => {
        const data = response.data;
        if (data.length > 0) {
          setUnreadNotif(true);
        } else {
          setUnreadNotif(false);
        }
        setLoading(false);
      })
      .catch(error => {
        console.log("ERROR in AXIOS FETCH");
        console.error(error);
        setLoading(false);
      });
  }, [newMessages]);

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
      console.log("Message received:", message);
      // Set newMessages to true only if the current tab is not 'messages'
      if (activeTab !== 'messages') {
        setNewMessages(true);
      }
    });

    newSocket.on('feedNotification', (message) => {
      console.log("Feed notification received:", message);
      // Set newFeed to true
      setNewFeed(true);
    });

    newSocket.on('generalNotification', (message) => {
      console.log("General notification received:", message);
      // Set newNotifications to true only if the current tab is not 'notifications'
      if (activeTab !== 'notifications') {
        setNewNotifications(true);
      }
    });

    newSocket.on('eventNotification', (message) => {
      console.log("Event notification received:", message);
      // Set newEvents to true only if the current tab is not 'events'
      if (activeTab !== 'events') {
        setNewEvents(true);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [token, activeTab]); // Add activeTab to dependencies to handle changes

  const handleTabSelection = (tab) => {
    // Set refresh state if re-selecting the same tab
    if (tab === activeTab) {
      setTabRefresh(prevState => ({
        ...prevState,
        [tab]: (prevState[tab] || 0) + 1 // Increment refresh key
      }));
    } else {
      setActiveTab(tab);
      // Reset notifications for the selected tab
      if (tab === 'messages') {
        setNewMessages(false);
      } else if (tab === 'home') {
        setNewFeed(false);
      } else if (tab === 'notifications') {
        setNewNotifications(false);
      } else if (tab === 'events') {
        setNewEvents(false);
      }
      setIsSidebarOpen(false);
    }
  };

  const updateNotification = async (notificationId) => {
    try {
      await api.patch(`/updateNotification`);
      console.log('Notification updated successfully');
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };
  

  const renderNotificationIcon = (icon, tab, hasNotification) => (
    <View style={styles.iconContainer}>
      <FontAwesomeIcon icon={icon} style={styles.headerIcon} size={27} />
      {/* Only show the red dot if there's a notification and we're not on the current tab */}
      {hasNotification && activeTab !== tab && <View style={styles.redDot} />}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home key={tabRefresh.home} />;
      case 'signup':
        return <Signup key={tabRefresh.signup} />;
      case 'events':
        return <Events key={tabRefresh.events} />;
      case 'notifications':
        return <Notification key={tabRefresh.notifications} />;
      case 'messages':
        return <Message key={tabRefresh.messages} />;
      case 'profile':
        return <Profile key={tabRefresh.profile} />;
      default:
        return <Home key={tabRefresh.home} />;
    }
  };

  return (
    <LinearGradient
      colors={['white', 'white']}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.linearGradient}
    >
      {/* Add the StatusBar component */}
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#f2f2f2" />
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <View style={styles.container}>
        <View style={styles.titleCon}>
          <Text style={styles.headerTitle}>UA ALUMNI HUB</Text>
        </View>
        <View style={styles.headerCon}>
          <TouchableOpacity onPress={() => setIsSidebarOpen(true)}>
            <FontAwesomeIcon icon={faBars} style={styles.headerIcon} size={27} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabSelection('home')}>
            {renderNotificationIcon(faHome, 'home', newFeed)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabSelection('events')}>
            {renderNotificationIcon(faCalendar, 'events', newEvents)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {handleTabSelection('notifications'); updateNotification()}}>
            {renderNotificationIcon(faBell, 'notifications', newNotifications || unreadNotif)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabSelection('messages')}>
            {renderNotificationIcon(faMessage, 'messages', newMessages)}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabSelection('profile')}>
            {renderNotificationIcon(faUserAlt, 'profile', false)}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.contentCon}>
        {renderContent()}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#7f1d1d',
    backgroundColor: '#f2f2f2',
  },
  headerCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerIcon: {
    color: "#7f1d1d",
    marginHorizontal: 5,
  },
  titleCon: {
    marginBottom: 10,
    alignItems: 'start',
  },
  headerTitle: {
    color: "#7f1d1d",
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentCon: {
    flex: 1,
  },
  iconContainer: {
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: 0,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: 'red',
  },
});

export default Header;
