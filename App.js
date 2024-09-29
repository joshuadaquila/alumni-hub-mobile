import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator, Alert, StatusBar } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import Events from './pages/Events';
import api, { loginUser, logoutUser } from './components/api/api';
import GraduateTracerSurvey from './pages/GraduateTracerSurvey';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import Constants from "expo-constants";
import ProfileView from './pages/ProfileView';
import Profile from './pages/Profile';

const Stack = createStackNavigator();



function App() {
  const [token, setToken] = useState(null);
  const [uName, setUName] = useState(null);
  const [loginErr, setLoginErr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize(Constants.expoConfig.extra.oneSignalAppId);

  // Also need enable notifications to complete OneSignal setup
  OneSignal.Notifications.requestPermission(true);

  useEffect(() => {
    const getPushSubscriptionInfo = async () => {
      try {
        // Retrieve push subscription ID
        const pushSubscriptionId = await OneSignal.User.pushSubscription.getIdAsync();
  
        if (pushSubscriptionId) {
          // Store the subscription ID securely
          await SecureStore.setItemAsync('subId', pushSubscriptionId);
          console.log("Push Subscription ID stored successfully ", pushSubscriptionId);
  
          // Make POST request to /setSubId with the pushSubscriptionId
          await api.post('/setSubId', { subId: pushSubscriptionId });
          console.log("Push Subscription ID posted successfully");
        }
      } catch (error) {
        console.error("Error retrieving or posting push subscription info:", error);
      }
    };
  
    // Call the function to get the push subscription info and post it
    getPushSubscriptionInfo();
  }, []); // Empty dependency array means this effect runs once on mount
  

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        const storedUName = await SecureStore.getItemAsync('uName');
        setToken(storedToken);
        setUName(storedUName);
      } catch (error) {
        console.error("Error loading token:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        Alert.alert("No Network Connection", "Please check your internet connection and try again.");
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password, navigation) => {
    if (!isConnected) {
      Alert.alert("No Network Connection", "Please check your internet connection and try again.");
      return;
    }
    
    console.log("LOGGING IN");
    try {
      const response = await api.post('/signin', { email, password });

      if (response.status === 200) {
        const newToken = response.data.token;
        const newUName = response.data.name;

        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('uName');

        setToken(newToken);
        setUName(newUName);
        await SecureStore.setItemAsync('token', newToken);
        await SecureStore.setItemAsync('uName', newUName);
        await loginUser(newToken);
        console.log("newtoken", newToken);
        navigation.navigate('Header');
        setLoginErr(null);
      } else {
        console.error("Login failed with status:", response.status);
        setLoginErr("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginErr(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const logout = async () => {
    setToken(null);
    setUName(null);
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('uName');
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={token ? "Header" : "Login"} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login">
          {(props) => (
            <Login 
              {...props} 
              handleLogin={(email, password) => login(email, password, props.navigation)} 
              error={loginErr} 
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Header">
          {(props) => (
            <Header
              {...props}
              uName={uName}
              handleLogout={logout}
              options={{
                headerShown: token ? true : false,
                headerRight: () => (
                  <Button title="Logout" onPress={logout} />
                ),
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Events">
          {(props) => (
            <Events
              {...props}
              uName={uName}
              handleLogout={logout}
              options={{
                headerShown: token ? true : false,
                headerRight: () => (
                  <Button title="Logout" onPress={logout} />
                ),
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Profile">
          {(props) => (
            <Profile
              {...props}
              uName={uName}
              handleLogout={logout}
              options={{
                headerShown: token ? true : false,
                headerRight: () => (
                  <Button title="Logout" onPress={logout} />
                ),
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ProfileView">
          {(props) => (
            <ProfileView
              {...props}
              uName={uName}
              handleLogout={logout}
              options={{
                headerShown: token ? true : false,
                headerRight: () => (
                  <Button title="Logout" onPress={logout} />
                ),
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="GraduateTracerSurvey">
          {(props) => (
            <GraduateTracerSurvey
              {...props}
              uName={uName}
              handleLogout={logout}
              options={{
                headerShown: token ? true : false,
                headerRight: () => (
                  <Button title="Logout" onPress={logout} />
                ),
              }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
