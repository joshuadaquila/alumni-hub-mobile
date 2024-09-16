import { faBars, faBug, faInfo, faNoteSticky, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, Image, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import ualogo from '../resources/ualogo.jpg'; // Correctly import the local image
import api, { logoutUser } from './api/api';

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarWidth = 250; // Width of the sidebar
  const { height } = Dimensions.get('window'); // Get screen height
  const translateX = useRef(new Animated.Value(-sidebarWidth)).current;
  const navigation = useNavigation();
  const [isLoggedOut, setIsLoggedOut] = useState(false); // Track if user is logged out

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -sidebarWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isLoggedOut) {
          BackHandler.exitApp(); // Close the app if logged out
          return true; // Prevent default back button behavior
        }
        return false; // Allow default behavior otherwise
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [isLoggedOut])
  );

  const handleNavigation = (screen) => {
    onClose(); // Close the sidebar
    navigation.navigate(screen);
  };

  const logout = () => {
    logoutUser();
    setIsLoggedOut(true); // Set logged out state to true
    handleNavigation('Login');
  };

  return (
    <>
      <Animated.View style={[styles.sidebar, { width: sidebarWidth, height, transform: [{ translateX }] }]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesomeIcon icon={faBars} color='white' size={24} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={ualogo} style={styles.logo} />
          <Text style={styles.logoText}>UA ENGAGEMENT HUB</Text>
        </View>
        <View style={styles.sidebarContent}>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('GraduateTracerSurvey')}>
            <FontAwesomeIcon icon={faNoteSticky} color='white' size={20} />
            <Text style={styles.sidebarText}>Graduate Tracer Survey</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('ReportBug')}>
            <FontAwesomeIcon icon={faBug} color='white' size={20} />
            <Text style={styles.sidebarText}>Report a bug (Soon)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('About')}>
            <FontAwesomeIcon icon={faInfo} color='white' size={20} />
            <Text style={styles.sidebarText}>About (Soon)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => logout()}>
            <FontAwesomeIcon icon={faSignOutAlt} color='white' size={20} />
            <Text style={styles.sidebarText}>Logout</Text>
          </TouchableOpacity>

        </View>
      </Animated.View>
      {isOpen && <TouchableOpacity style={styles.overlay} onPress={onClose} />}
    </>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#7f1d1d',
    padding: 20,
    justifyContent: 'space-between',
    zIndex: 1000,
    elevation: 5, // For Android shadow

  },
  sidebarContent: {
    flex: 1,
    marginTop: 20, // Add margin to ensure content doesn't overlap with the close button
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sidebarText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  closeButton: {
    borderRadius: 5,
    alignSelf: 'flex-end', // Align close button to the top right
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20, // Add margin to separate from menu items
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
    marginBottom: 10
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Sidebar;
