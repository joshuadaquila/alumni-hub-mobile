import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../components/api/api';

function Signup() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [graduationyear, setGradyear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setLoading] = useState(false);

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
        email,
        password
      }, { withCredentials: true });
      Alert.alert("Success", "Registration successful");
      console.log(response.data); // handle response as needed
    } catch (error) {
      setErrors([...errors, error.response?.status || "Unknown error"]);
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

  return (
    <LinearGradient
      colors={['rgb(255, 226, 226)', 'rgb(166, 213, 255)', '#192f6a']}
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
          <Text style={styles.header}>Sign Up</Text>
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
              <TextInput
                style={styles.input}
                value={birthday}
                onChangeText={(text) => setBirthday(text)}
                required
              />
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
            <Text style={styles.passwordNote}>
              Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, and one special character.
            </Text>
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
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
  },
  asterisk: {
    color: 'red',
  },
  button: {
    backgroundColor: '#374151',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  passwordNote: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  linearGradient: {
    flex: 1,
  },
});

export default Signup;
