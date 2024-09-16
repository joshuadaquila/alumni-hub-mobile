import { faThumbsUp, faPlus, faHeart, faArrowAltCircleUp, faEllipsisH, faPen, faTrash, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator, Modal, Dimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from './api/api';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

export default function FeedContainer({ feedid, profilepicurl, username, content: initialContent, alumniid, datestamp, photourl, onDelete }) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uName, setUname] = useState();
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(initialContent);
  const [content, setContent] = useState(initialContent);
  const [isAddingComment, setIsAddingComment] = useState(false); // Separate loading state for adding comment
  const [isSavingContent, setIsSavingContent] = useState(false); // Separate loading state for saving content
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [selectedPhoto, setSelectedPhoto] = useState(''); // Currently selected photo URL

  useEffect(() => {
    async function getToken() {
      const uname = await SecureStore.getItemAsync('uName');
      setUname(uname);
    }
    getToken();
    fetchComments();
    fetchLikes();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/getComments/${feedid}`);
      setComments(response.data);
      // console.log(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Alert.alert('Failed to fetch comments. Please try again.');
    }
  };

  const fetchLikes = async () => {
    try {
      const userLikeResponse = await api.get(`/hasLiked/${feedid}`);
      setHasLiked(userLikeResponse.data.hasLiked);
      
      const response = await api.get(`/getLikes/${feedid}`);
      setLikes(response.data.totalLikes);

      // Check if the user has already liked the post
      
    } catch (error) {
      console.error('Error fetching likes:', error);
      // Alert.alert('Failed to fetch likes. Please try again.');
    }
  };

  const handleLike = async () => {
    try {
      if (!hasLiked) {
        await api.post('/likePost', { feedid });
        setLikes(likes + 1);
        setHasLiked(true);
      } else {
        await api.post('/unlikePost', { feedid });
        setLikes(likes - 1);
        setHasLiked(false);
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      // Alert.alert('Failed to update like status. Please try again.');
    }
  };

  const handleComment = async () => {
    if (comment.trim() !== '') {
      try {
        setIsAddingComment(true);
        await api.post('/addComment', { feedid, content: comment });
        setComment('');
        fetchComments(); // Re-fetch comments to include the new one
      } catch (error) {
        console.error('Error adding comment:', error);
        // Alert.alert('Failed to add comment. Please try again.');
      } finally {
        setIsAddingComment(false);
      }
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

  const handleEdit = () => {
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleSave = async () => {
    setIsSavingContent(true);
    try {
      await api.put(`/updatePost/${feedid}`, {
        content: editableContent
      });
      setIsEditing(false);
      setContent(editableContent);
    } catch (error) {
      console.error('Error updating post:', error);
      // Alert.alert('Failed to update post. Please try again.');
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleDelete = async () => {
    onDelete(feedid);
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
        {uName === username && (
          <TouchableOpacity style={styles.options} onPress={() => setShowOptions(!showOptions)}>
            <FontAwesomeIcon icon={faEllipsisH} />
          </TouchableOpacity>
        )}
        {showOptions && (
          <View style={styles.optionsCon}>
            <TouchableOpacity style={styles.optionbtn} onPress={handleEdit}>
              <FontAwesomeIcon icon={faPen} />
              <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionbtn} onPress={handleDelete}>
              <FontAwesomeIcon icon={faTrash} />
              <Text style={styles.optionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {isEditing ? (
        <TextInput
          style={styles.editableContent}
          value={editableContent}
          onChangeText={setEditableContent}
          multiline
        />
      ) : (
        <Text style={styles.content}>{content}</Text>
      )}

      <View style={styles.photosContainer}>
        {photoUrls != "" && photoUrls.map((url, index) => (
          <TouchableOpacity key={index} onPress={() => {
            setSelectedPhoto(url);
            setModalVisible(true);
          }}>
            <Image source={{ uri: url }} style={styles.photo} />
          </TouchableOpacity>
        ))}
      </View>

      {isEditing && (
        <TouchableOpacity
          style={[styles.saveButton, isSavingContent && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSavingContent}
        >
          {isSavingContent ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      )}

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <FontAwesomeIcon icon={faThumbsUp} size={20} color={hasLiked ? 'red' : 'black'} />
          <Text style={styles.actionText}>{likes}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.commentsList}>
        {comments.slice(0, isExpanded ? comments.length : 2).map((commentObj, index) => (
          <View key={index} style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Image source={{ uri: commentObj.photourl }} style={{width: 40, height: 40, borderRadius: 20, marginRight: 4,}} />
            <View style={styles.commentContainer}>
              <Text style={styles.feedId}>{commentObj.name}</Text>
              <Text style={styles.comment}>{commentObj.content}</Text>
              <Text style={styles.timestamp}>{new Date(commentObj.date).toLocaleString()}</Text>
            </View>
          </View>
        ))}
        {comments.length > 2 && (
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.seeMoreText}>{isExpanded ? 'See Less...' : 'See More...'}</Text>
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

        <TouchableOpacity onPress={handleComment} style={styles.sendButton} disabled={isAddingComment}>
          {isAddingComment ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              {/* <Text style={styles.sendButtonText}>Add</Text> */}
              <FontAwesomeIcon icon={faPaperPlane} color='white' />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal for Viewing Enlarged Photo */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
            <FontAwesomeIcon icon={faXmarkCircle} color='white' size={25} />
          </TouchableOpacity>
          <Image source={{ uri: selectedPhoto }} style={styles.modalImage} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Existing styles...
  container: {
    backgroundColor: '#f2f2f2',
    padding: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 5,
  },
  options: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  optionsCon: {
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 2,
    position: 'absolute',
    top: 20,
    right: 15,
  },
  optionbtn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 4
  },
  optionText: {
    marginLeft: 4,
  },
  feedId: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  content: {
    marginTop: 8,
    marginBottom: 8,
  },
  editableContent: {
    marginTop: 8,
    marginBottom: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  date: {
    color: '#4f4f4f',
    marginTop: 4,
  },
  photosContainer: {
    height: 'auto',
    width: 'auto',
    marginTop: 8,
  },
  photo: {
    width: 'auto',
    height: 500,
    marginBottom: 8,
  },
  profilePic: {
    backgroundColor: "red",
    height: 50,
    width: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4f4f4f',
  },
  actionsContainer: {
    flexDirection: 'row',
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
    maxWidth: '93%',
    borderRadius: 3,
  },
  timestamp: {
    fontSize: 12,
    color: '#4f4f4f',
    marginTop: 2,
  },
  seeMoreText: {
    color: '#007BFF',
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
    backgroundColor: '#7f1d1d',
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
  saveButton: {
    backgroundColor: '#1c1c1e',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 50,
    zIndex: 99,
    // padding: 10,
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  modalImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height ,
    resizeMode: 'contain',
  },
});
