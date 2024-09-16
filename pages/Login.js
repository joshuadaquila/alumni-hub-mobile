import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, BackHandler, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ualogo from '../resources/ualogo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExclamationCircle, faPen, faSignIn } from '@fortawesome/free-solid-svg-icons';
import { ActivityIndicator } from 'react-native';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

const Login = ({ handleLogin, navigation, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null); // Local state for login error
  const [isLoading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setLoginError(error); // Update local loginError state when error prop changes
  }, [error]);

  useEffect(() => {
    // Handle the back button press
    const backAction = () => {
      // Show an alert or perform any action before exiting the app
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => BackHandler.exitApp(), // Exit the app
        },
      ]);
      return true; // Prevent the default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      setLoginError('Email and password are required');
      return;
    }

    setLoading(true);
    setDisabled(true);
    setLoginError(null); // Clear any previous errors

    try {
      await handleLogin(email, password);
      setLoading(false);
      setDisabled(false);
      setLoginError(error);
    } catch (err) {
      console.log("Error during login:", err);
      setLoginError(err.response?.status || 'Unknown error');
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['white','white']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.linearGradient}
      >
        <View style={styles.loginCon}>
          <Text style={styles.title}>ALUMNI TRACER AND ENGAGEMENT HUB</Text>
          <Image source={ualogo} style={styles.logo} />

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => { setEmail(text); setLoginError(null)}}
              autoCapitalize="none"
              autoCompleteType="email"
              keyboardType="email-address"
              returnKeyType="next"
            />
            <View style={{position: 'relative'}}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => {setPassword(text); setLoginError(null)}}
                secureTextEntry={!passwordVisible}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.eye} onPress={() => setPasswordVisible(!passwordVisible)}>
                <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
              </TouchableOpacity>
            </View>
            {loginError ?
              <View style={styles.errorCon}> 
                <FontAwesomeIcon icon={faExclamationCircle} color='red'/>
                <Text style={styles.errorText}>{loginError}</Text> 
              </View>
              :  
              <Text style={styles.errorText} opacity={0}>Hidden</Text> 
            }
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={disabled}>
              {isLoading ? <ActivityIndicator color="#ffffff" /> : (
                <>
                  <FontAwesomeIcon icon={faSignIn} color='white' style={styles.icon} />
                  <Text style={styles.buttonText}>Log in</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.orContainer}>
              <View style={styles.border} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.border} />
            </View>

            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('Signup'); }}>
              <FontAwesomeIcon icon={faPen} color='white' style={styles.icon} />
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginCon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
  logo: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginTop: 20,
  },
  formContainer: {
    padding: 20,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    margin: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#7f1d1d',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', // Set flex direction to row
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 2, // Add margin to separate icon and text
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  border: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: 'black',
  },
  errorCon:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 13,
    color: 'red',
    textAlign: 'center',
    padding: 5,
  },
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 2, // Add margin to separate icon and text
  },
  eye: {
    position: 'absolute',
    top: '25%',
    right: '5%',
  },
});

export default Login;
