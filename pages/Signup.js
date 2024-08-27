import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../components/api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation for navigation

function Signup() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [graduationyear, setGradyear] = useState("");
  const [program, setProgram] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation(); // Initialize navigation

  const isFormValid = () => {
    return name && address && birthday && graduationyear && email && password && confirmPassword;
  };

  const register = async () => {
    if (!isFormValid()) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }
  
    setLoading(true);
    const errors = validatePassword(password, confirmPassword);
    if (errors.length > 0) {
      setErrors(errors);
      setLoading(false);
      return;
    }
  
    try {
      const response = await api.post('/signup', {
        name,
        address,
        birthday,
        graduationyear,
        program,
        email,
        password
      }, { withCredentials: true });
  
      Alert.alert(
        "Success", 
        "Registration successful",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate('Login'); // Navigate to the Login screen or reset form fields
              // Optionally, reset form fields here if needed:
              // setName(""); setAddress(""); setBirthday(""); setGradyear(""); setProgram(""); setEmail(""); setPassword(""); setConfirmPassword("");
            }
          }
        ]
      );
      console.log(response.data); // handle response as needed
    } catch (error) {
      if (error.response?.status === 409) {
        Alert.alert("Email Taken", "The email address is already in use. Please use a different email.");
      } else {
        setErrors([...errors, error.response?.status || "Unknown error"]);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const validatePassword = (password, confirmPassword) => {
    const errors = [];
    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    return errors;
  };

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      const formattedDate = currentDate.toISOString().split('T')[0];
      setShowDatePicker(false);
      setBirthday(formattedDate);
    }
  };

  return (
    <LinearGradient
      colors={['white', 'white' ]}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.linearGradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../resources/ualogo.jpg')} style={styles.logo} />
          <Text style={styles.title}>Be a part of the community, KASUBAY!</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.header}>Account Registration</Text>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name <Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => setName(text)}
                required
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address <Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={(text) => setAddress(text)}
                required
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Birthday (YYYY-MM-DD) <Text style={styles.asterisk}>*</Text></Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <TextInput
                style={styles.inputDate}
                value={birthday}
                onChangeText={(text) => setBirthday(text)}
                required
              />

              {showDatePicker && (<DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                // mode={mode}
                disabled={true}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />)}

              <TouchableOpacity onPress={()=> setShowDatePicker(!showDatePicker)}>
                <FontAwesomeIcon icon={faCalendarPlus} size={20} />
              </TouchableOpacity>
              </View>


            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Year Graduated <Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={graduationyear}
                onChangeText={(text) => setGradyear(text)}
                required
              />
              
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Program <Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={program}
                onChangeText={(text) => setProgram(text)}
                placeholder='e.g. BS Computer Science'
                required
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email <Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
                required
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password <Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
                required
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password <Text style={styles.asterisk}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                secureTextEntry
                required
              />
            </View>
            <View style={styles.passwordNote}>
              <FontAwesomeIcon icon={faInfoCircle}/>
              <Text>Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, and one special character.</Text>
            </View>
            {errors.length > 0 && (
              <View style={styles.errorContainer}>
                {errors.map((error, index) => (
                  <Text key={index} style={styles.errorText}>{error}</Text>
                ))}
              </View>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={register}
              disabled={isLoading} // Disable button if loading
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  asterisk: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  inputDate: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
    width: '85%'
  },
  button: {
    backgroundColor: '#7f1d1d',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
  passwordNote: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Signup;
