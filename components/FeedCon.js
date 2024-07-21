import { faThumbsUp, faPlus, faHeart, faArrowUp, faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';

export default function FeedContainer({ feedid, profilepicurl, username, content, alumniid, datestamp, photourl }) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    } else {
      Alert.alert('You have already liked this post.');
    }
  };

  const handleComment = () => {
    if (comment.trim() !== '') {
      const timestamp = new Date().toLocaleString(); // Get the current timestamp
      setComments([...comments, { text: comment, timestamp }]);
      setComment('');
    } else {
      Alert.alert('Comment cannot be empty.');
    }
  };

  const cleanPhotoUrls = (urlArray) => {
    if (typeof urlArray === 'string' && urlArray.startsWith('[') && urlArray.endsWith(']')) {
      const cleanedString = urlArray.substring(1, urlArray.length - 1);
      const urls = cleanedString.split('","').map(url => url.replace(/^"|"$/g, ''));
      return urls;
    }
    return [];
  };

  const photoUrls = cleanPhotoUrls(photourl);

  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
        <Image source={{ uri: profilepicurl }} style={styles.profilePic} />
        <View>
          <Text style={styles.feedId}>{username}</Text>
          <Text style={styles.date}>{new Date(datestamp).toLocaleString()}</Text>
        </View>
      </View>
      
      <Text style={styles.content}>{content}</Text>

      <View style={styles.photosContainer}>

        {photoUrls != ""? photoUrls.map((url, index) => (
          <Image key={index} source={{ uri: url }} style={styles.photo} />
        )): ""}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <FontAwesomeIcon icon={faArrowAltCircleUp} />
          <Text style={styles.actionText}>Like ({likes})</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.commentsList}>
        {comments.slice(0, isExpanded ? comments.length : 2).map((commentObj, index) => (
          <View key={index} style={styles.commentContainer}>
            
            <Text style={styles.comment}>{commentObj.text}</Text>
            <Text style={styles.timestamp}>{commentObj.timestamp}</Text>
          </View>
        ))}
        {comments.length > 2 && (
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.seeMoreText}>{isExpanded ? 'See Less' : 'See More'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
        />
        
        <TouchableOpacity onPress={handleComment} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Add</Text>
          <FontAwesomeIcon icon={faPlus} color='white' />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
    padding: 8, 
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 5,
  },
  feedId: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  content: {
    marginTop: 8,
    marginBottom: 8,
  },
  alumniId: {
    color: '#555',
  },
  date: {
    color: '#4f4f4f',
    marginTop: 4,
  },
  photosContainer: {
    marginTop: 8,
  },
  photo: {
    width: '100%',
    height: 200,
    marginBottom: 8,
  },
  profilePic:{
    backgroundColor: "red",
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  postHeader:{
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
  },
  commentsList: {
    marginTop: 10,
  },
  commentContainer: {
    marginBottom: 5,
  },
  comment: {
    // backgroundColor: '#f1f1f1',
    // padding: 5,
    borderRadius: 3,
  },
  timestamp: {
    fontSize: 12,
    color: '#4f4f4f',
    marginTop: 2,
  },
  seeMoreText: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 5,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
  },
  sendButton: {
    backgroundColor: '#1c1c1e',
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  sendButtonText: {
    color: '#fff',
    marginRight: 5,
  },
});
