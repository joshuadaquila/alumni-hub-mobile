import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://ua-alumhi-hub-be.onrender.com' // Default base URL https://ua-alumhi-hub-be.onrender.com http://192.168.14.71:3001',
});

// Function to set the token in the headers
const setAuthToken = async () => {
  const token = await SecureStore.getItemAsync('token');
  console.log("old token", token);
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Initialize the token when the app starts
const initializeToken = async () => {
  await setAuthToken();
};

// Initialize token when the module is loaded
initializeToken();

// Function to log in the user
export const loginUser = async (token) => {
  await SecureStore.setItemAsync('token', token);
  await setAuthToken();
};

// Function to log out the user
export const logoutUser = async () => {
  await SecureStore.deleteItemAsync('token');
  await setAuthToken();
  console.log("USER LOGGED OUT!!");
};

// Add a response interceptor
api.interceptors.response.use(
  response => response, // Pass through the successful response
  async error => {
    if (error.response && error.response.status === 401) {
      // If the response status is 401, log out the user
      await logoutUser();
      // Optionally, you can redirect the user to the login screen or show a message
      // For example:
      // window.location.href = '/login'; // For web apps
      // You might need to navigate programmatically if using React Navigation in a mobile app
    }
    return Promise.reject(error);
  }
);

export default api;
