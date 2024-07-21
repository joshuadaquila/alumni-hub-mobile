import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarAlt, faMessage } from '@fortawesome/free-solid-svg-icons';

function NotificationCon({ message, sentdate, type }) {
  return (
    <View style={styles.notificationContainer}>
      <View style={styles.messageContainer}>
        {type === "event" ? (
          <FontAwesomeIcon icon={faCalendarAlt} style={styles.icon} size={24} />
        ) : (
          <FontAwesomeIcon icon={faMessage} style={styles.icon} size={24} />
        )}
        <View style={styles.messageTextContainer}>
          <Text style={styles.messageText}>{message}...</Text>
        </View>
      </View>
      <Text style={styles.dateText}>{sentdate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
    width: '100%', // Full width to fit the screen
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items to the start to prevent overlap
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    // backgroundColor: "red",
    flex: 1,
  },
  icon: {
    marginRight: 16,
  },
  messageTextContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'left',
  },
  dateText: {
    opacity: 0.6,
    fontSize: 14,
    marginLeft: 16, // Ensure there's space between message and date
  },
});

export default NotificationCon;
