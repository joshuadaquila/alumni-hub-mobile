import { faBars, faBell, faCalendar, faHome, faMessage, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import Events from '../pages/Events';
import { LinearGradient } from 'expo-linear-gradient';
import Notification from '../pages/Notification';
import Message from '../pages/Message';
import Profile from '../pages/Profile';
import Sidebar from './Sidebar'; // Ensure you have this import

const Header = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  const renderContent = () => {
    if (activeTab === 'home') {
      return <Home />;
    } else if (activeTab === 'signup') {
      return <Signup />;
    } else if (activeTab === 'events') {
      return <Events />;
    } else if (activeTab === 'notifications') {
      return <Notification />;
    } else if (activeTab === 'messages') {
      return <Message />;
    } else if (activeTab === 'profile') {
      return <Profile />;
    }
  };

  const handleTabSelection = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close the sidebar when a tab is selected
  };

  return (
    <LinearGradient
      colors={['rgb(255, 226, 226)', 'rgb(166, 213, 255)', '#192f6a']}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.linearGradient}
    >
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
            <FontAwesomeIcon icon={faHome} style={styles.headerIcon} size={27} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabSelection('events')}>
            <FontAwesomeIcon icon={faCalendar} style={styles.headerIcon} size={27} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabSelection('notifications')}>
            <FontAwesomeIcon icon={faBell} style={styles.headerIcon} size={27} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabSelection('messages')}>
            <FontAwesomeIcon icon={faMessage} style={styles.headerIcon} size={27} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabSelection('profile')}>
            <FontAwesomeIcon icon={faUserAlt} style={styles.headerIcon} size={27} />
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
    // marginTop: 20,
    padding: 16,
    borderBottomWidth: 2,
    backgroundColor: '#f2f2f2',
  },
  headerCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerIcon: {
    color: "#1c1c1e",
    marginHorizontal: 5,
  },
  titleCon: {
    marginBottom: 10,
    alignItems: 'start',
  },
  headerTitle: {
    color: "#1c1c1e",
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentCon: {
    flex: 1,
  },
});

export default Header;
