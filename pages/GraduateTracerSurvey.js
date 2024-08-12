import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Button, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import Checkbox from 'react-native-checkbox';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarPlus, faCamera, faImage, faX } from '@fortawesome/free-solid-svg-icons';
import api from '../components/api/api';
import { ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

const chedLogo = require("../resources/ched-logo.png");
const uaLogo = require('../resources/ualogo.jpg');

const GraduateTracerSurvey = () => {
  const [isLoading, setIsLoading] = useState(false);
  // GENERAL INFO
  const [name, setName] = useState('');
  const [permanentAdd, setPermanentAdd] = useState('');
  const [email, setEmailAdd] = useState('');
  const [contactNum, setContactNum] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [civilStat, setCivilStat] = useState('Single');
  const [sex, setSex] = useState('');
  const [birthday, setBirthday] = useState();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [region, setRegion] = useState('Region 1');
  const [province, setProvince] = useState('');
  const [residence, setResidence] = useState('');

  useEffect(() => {
    // Fetch profile information from the server
    api.get('/getAlumniInfo')
      .then(response => {
        const alumniInfo = response.data[0];
  
        setName(alumniInfo.name);
        setPermanentAdd(alumniInfo.address);
        setEmailAdd(alumniInfo.email);
  
        // Format the birthday to yyyy-mm-dd
        const formattedBirthday = new Date(alumniInfo.birthday).toISOString().slice(0, 10);
        setBirthday(formattedBirthday);
  
        // setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.log("ERROR IN GTS get alumni");
        console.error(error);
        // setLoading(false); // Set loading to false in case of error
      });
  }, []);
  

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      const formattedDate = currentDate.toISOString().split('T')[0];
      setShowDatePicker(false);
      setBirthday(formattedDate);
    }
  };

  const setAwardDate = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      const formattedDate = currentDate.toISOString().split('T')[0];
      setShowDatePicker(false);
      setDate(formattedDate);
    }
  };

  // EDUCATIONAL BACKGROUND
  // Educ Attainment
  // const [degree, setDegree] = useState('');
  // const [college, setCollege] = useState('');
  // const [yearGrad, setYearGrad] = useState('');

  const [educationalAttain, setEducationalAttain] = useState([{degree: '', college: '', yearGrad: '', honor: ''}])

  const [section, setSection] = useState(null);
  const [professionalExams, setProfessionalExams] = useState([{ name: '', date: '', rating: '' }]);
  const [trainings, setTrainings] = useState([{ title: '', duration: '', institution: '' }]);

  const toggleSection = (sectionName) => {
    setSection(section === sectionName ? null : sectionName);
  };

  const addProfessionalExam = () => {
    setProfessionalExams([...professionalExams, { name: '', date: '', rating: '' }]);
  };
  const addBaccalaureateDegree = () => {
    setEducationalAttain([...educationalAttain, {degree: '', college: '', yearGrad: '', honor: ''}]);
  };

  const addTraining = () => {
    setTrainings([...trainings, { title: '', duration: '', institution: '' }]);
  };

  const [undergraduateReasons, setUndergraduateReasons] = useState({
    highGrades: false,
    goodGradesHS: false,
    parentInfluence: false,
    peerInfluence: false,
    roleModel: false,
    passionProfession: false,
    immediateEmployment: false,
    statusPrestige: false,
    courseAvailability: false,
    careerAdvancement: false,
    affordableFamily: false,
    attractiveCompensation: false,
    employmentAbroad: false,
    noParticularChoice: false,
    others: false,
  });

  const [graduateReasons, setGraduateReasons] = useState({
    highGrades: false,
    goodGradesHS: false,
    parentInfluence: false,
    peerInfluence: false,
    roleModel: false,
    passionProfession: false,
    immediateEmployment: false,
    statusPrestige: false,
    courseAvailability: false,
    careerAdvancement: false,
    affordableFamily: false,
    attractiveCompensation: false,
    employmentAbroad: false,
    noParticularChoice: false,
    others: false,
  });

  const handleUndergraduateReasonChange = (reason) => {
    setUndergraduateReasons((prevReasons) => ({
      ...prevReasons,
      [reason]: !prevReasons[reason],
    }));
  };

  const handleGraduateReasonChange = (reason) => {
    setGraduateReasons((prevReasons) => ({
      ...prevReasons,
      [reason]: !prevReasons[reason],
    }));
  };

  //C. TRAINING
  const [reasonAdvanceStud, setReasonAdvanceStud] = useState('For promotion');

  // D. EMPLOYMENT
  const [presentlyEmployed, setPresentlyEmployed] = useState('Yes');

  const handleReasonUnemployedChange = (reason) => {
    setReasonUnemployed((prevReasons) => ({
      ...prevReasons,
      [reason]: !prevReasons[reason],
    }));
  };
  const [reasonUnemployed, setReasonUnemployed] = useState ({
    advanceStudy: false,
    familyConcern: false,
    health: false,
    lackWorkExp: false,
    noJobOp: false,
    notLookJob: false
  })
  const [presentEmployStat, setPresentEmployStat] = useState('Regular or Permanent');
  const [skillsAcquired, setSkillsAcquired] = useState();
  const [presentOccupation, setPresentOccupation] = useState('');
  const [majorLine, setMajorLine] = useState('Health and Social Work');
  const [placeOfWork, setPlaceOfWork] = useState('Local');
  const [firstJobAfterJob, setFirstJobAfterJob] = useState('Yes');

  const handleReasonStayingJobChange = (reason) => {
    setReasonStayingJob((prevReasons) => ({
      ...prevReasons,
      [reason]: !prevReasons[reason],
    }));
  };
  const [reasonStayingJob, setReasonStayingJob] = useState({
    salaries: false,
    careerChallenge: false,
    specialSkill: false,
    relatedToCourse: false,
    proximityToResidence: false,
    peerInfluence: false,
    familyInfluence: false
  });
  const [firstJobRelatedToCourse, setFirstJobRelatedToCourse] = useState('No')
  const handleReasonAcceptingJobChange = (reason) => {
    setReasonAcceptingJob((prevReasons) => ({
      ...prevReasons,
      [reason]: !prevReasons[reason],
    }));
  };
  const [reasonAcceptingJob, setReasonAcceptingJob] = useState({
    salaries: false,
    careerChallenge: false,
    relatedToCourse: false,
    proximityToResidence: false,
  });
  const handleReasonChangingJobChange = (reason) => {
    setReasonChangingJob((prevReasons) => ({
      ...prevReasons,
      [reason]: !prevReasons[reason],
    }));
  };
  const [reasonChangingJob, setReasonChangingJob] = useState({
    salaries: false,
    careerChallenge: false,
    relatedToCourse: false,
    proximityToResidence: false,
  });
  const [durationFirstJob, setDurationFirstJob] = useState('Less than a month');
  const handleHowFindFirstJobChange = (reason) => {
    setHowFindFirstJob((prevReasons) => ({
      ...prevReasons,
      [reason]: !prevReasons[reason],
    }));
  };
  const [howFindFirstJob, setHowFindFirstJob] = useState({
    advertisment: false,
    schoolplacement: false,
    walkin: false,
    familybusiness: false,
    reco: false,
    jobfair:false
  })
  const [durationJobSeeking, setDurationJobSeeking] = useState('Less than a month')
  const [firstJobLvl, setFirstJobLvl] = useState("Rank or Clerical");
  const [secondJobLvl, setSecondJobLvl] = useState("Rank or Clerical");
  const [earning, setEarning] = useState("Below P5,000.00");
  const [curriculumRelevance, setCurriculumRelevance] = useState("Yes");
  const handleCompetenciesChange = (reason) => {
    setCompetencies((prevReasons) => ({
      ...prevReasons,
      [reason]: !prevReasons[reason],
    }));
  };
  const [competencies, setCompetencies] = useState({
    communication: false,
    humanrelation: false,
    entrepreneurial: false,
    informationtech: false,
    problemsolving: false,
    criticalthinking: false,
  });
  const [suggestion, setSuggestion] = useState('');

  // CONTRIBUTION

  const [awardName, setAwardName] = useState('');
  const [awardBody, setAwardBody] = useState('');
  const [date, setDate] = useState('');

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleSelectImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setSelectedImage(result.uri);
      }
    } else {
      Alert.alert('Permission Denied', 'Permission to access media library was denied.');
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'No image selected.');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    try {
      const response = await fetch('http://your-backend-url/uploadImage', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Image upload failed!');
      }

      Alert.alert('Success', 'Image uploaded successfully!');
      setSelectedImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image.');
    }
  };
  const handleRemoveFile = (uri) => {
    setSelectedFiles(selectedFiles.filter(file => file.uri !== uri));
  };

  const showAlert = () => {
    Alert.alert(
      "Success!",
      "Your response has been saved.",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  };
  

  const handleSubmitGenInfo = async () => {
    console.log("Province", province);
    console.log(name);
    setIsLoading(true);
  
    try {
      // First, check if there is an existing record
      const checkResponse = await api.get('/getSurveyGenInfo');
  
      console.log('Check Response:', checkResponse);
  
      if (checkResponse.data.length > 0) {
        // If a record exists, ask for confirmation before proceeding
        console.log('Record exists. Prompting user for confirmation.');
        
        Alert.alert(
          "Record Exists",
          "A record already exists. Do you want to update it?",
          [
            {
              text: "Cancel",
              onPress: () => {
                // console.log('User opted not to update. Exiting.');
                setIsLoading(false);
              },
              style: "cancel"
            },
            { 
              text: "OK", 
              onPress: async () => {
                // Proceed to submit the general information
                const response = await api.post('/submitGeneralInfo', {
                  name, permanentAdd, email, contactNum, mobileNum, civilStat, sex, birthday, region, province, residence,
                });
  
                if (response.status === 200) {
                  // Handle success, e.g., show a success message or redirect the user
                  // console.log('Gen Info submitted successfully:', response.data);
                  showAlert('General information submitted successfully!');
                } else {
                  // Handle unexpected status code
                  console.log('Unexpected response:', response);
                }
              }
            }
          ]
        );
      } else {
        // No existing record, proceed with submitting the information
        const response = await api.post('/submitGeneralInfo', {
          name, permanentAdd, email, contactNum, mobileNum, civilStat, sex, birthday, region, province, residence,
        });
  
        if (response.status === 200) {
          // console.log('Gen Info submitted successfully:', response.data);
          showAlert('General information submitted successfully!');
        } else {
          console.log('Unexpected response:', response);
        }
      }
    } catch (error) {
      // Handle errors
      console.error('Error in GEN INFO submitting survey:', error);
      showAlert('Error submitting general information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitEducBack = async () => {
    setIsLoading(true);
  
    try {
      // First, check if there is an existing record
      const checkResponse = await api.get('/getSurveyEducBack');
  
      if (checkResponse.data.length > 0) {
        // If a record exists, ask for confirmation before proceeding
        Alert.alert(
          "Record Exists",
          "A record already exists. Do you want to update it?",
          [
            {
              text: "Cancel",
              onPress: () => {
                setIsLoading(false);
              },
              style: "cancel"
            },
            { 
              text: "OK", 
              onPress: async () => {
                const response = await api.post('/submitEducationalBackground', {
                  educationalAttain, professionalExams, undergraduateReasons, graduateReasons
                });
  
                if (response.status === 200) {
                  showAlert('Educational background submitted successfully!');
                } else {
                  console.log('Unexpected response:', response);
                }
              }
            }
          ]
        );
      } else {
        // No existing record, proceed with submitting the information
        const response = await api.post('/submitEducationalBackground', {
          educationalAttain, professionalExams, undergraduateReasons, graduateReasons
        });
  
        if (response.status === 200) {
          showAlert('Educational background submitted successfully!');
        } else {
          console.log('Unexpected response:', response);
        }
      }
    } catch (error) {
      console.error('Error in EDUC BACK submitting survey:', error);
      showAlert('Error submitting educational background. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitTraining = async () => {
    setIsLoading(true);
  
    try {
      // First, check if there is an existing record
      const checkResponse = await api.get('/getSurveyTraining');
  
      if (checkResponse.data.length > 0) {
        Alert.alert(
          "Record Exists",
          "A record already exists. Do you want to update it?",
          [
            {
              text: "Cancel",
              onPress: () => {
                setIsLoading(false);
              },
              style: "cancel"
            },
            { 
              text: "OK", 
              onPress: async () => {
                const response = await api.post('/submitTraining', {
                  trainings, reasonAdvanceStud
                });
  
                if (response.status === 200) {
                  showAlert('Training data submitted successfully!');
                } else {
                  console.log('Unexpected response:', response);
                }
              }
            }
          ]
        );
      } else {
        const response = await api.post('/submitTraining', {
          trainings, reasonAdvanceStud
        });
  
        if (response.status === 200) {
          showAlert('Training data submitted successfully!');
        } else {
          console.log('Unexpected response:', response);
        }
      }
    } catch (error) {
      console.error('Error in TRAINING submitting survey:', error);
      showAlert('Error submitting training data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitEmployment = async () => {
    setIsLoading(true);
  
    try {
      // First, check if there is an existing record
      const checkResponse = await api.get('/getSurveyEmployment');
  
      if (checkResponse.data.length > 0) {
        Alert.alert(
          "Record Exists",
          "A record already exists. Do you want to update it?",
          [
            {
              text: "Cancel",
              onPress: () => {
                setIsLoading(false);
              },
              style: "cancel"
            },
            { 
              text: "OK", 
              onPress: async () => {
                const response = await api.post('/submitEmploymentData', {
                  presentlyEmployed, reasonUnemployed, presentEmployStat, skillsAcquired, presentOccupation, majorLine, placeOfWork, firstJobAfterJob,
                  reasonStayingJob, firstJobRelatedToCourse, reasonAcceptingJob, reasonChangingJob, durationFirstJob, howFindFirstJob, durationJobSeeking, firstJobLvl,
                  secondJobLvl, earning, curriculumRelevance, competencies, suggestion
                });
  
                if (response.status === 200) {
                  showAlert('Employment data submitted successfully!');
                } else {
                  console.log('Unexpected response:', response);
                }
              }
            }
          ]
        );
      } else {
        const response = await api.post('/submitEmploymentData', {
          presentlyEmployed, reasonUnemployed, presentEmployStat, skillsAcquired, presentOccupation, majorLine, placeOfWork, firstJobAfterJob,
          reasonStayingJob, firstJobRelatedToCourse, reasonAcceptingJob, reasonChangingJob, durationFirstJob, howFindFirstJob, durationJobSeeking, firstJobLvl,
          secondJobLvl, earning, curriculumRelevance, competencies, suggestion
        });
  
        if (response.status === 200) {
          showAlert('Employment data submitted successfully!');
        } else {
          console.log('Unexpected response:', response);
        }
      }
    } catch (error) {
      console.error('Error in EMPLOYMENT submitting survey:', error);
      showAlert('Error submitting employment data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitContribution = async () => {
    setIsLoading(true);
  
    try {
      // First, check if there is an existing record
      const checkResponse = await api.get('/getSurveyContribution');
  
      if (checkResponse.data.length > 0) {
        Alert.alert(
          "Record Exists",
          "A record already exists. Do you want to update it?",
          [
            {
              text: "Cancel",
              onPress: () => {
                setIsLoading(false);
              },
              style: "cancel"
            },
            { 
              text: "OK", 
              onPress: async () => {
                const response = await api.post('/submitContributionProfile', {
                  awardName, awardBody, date, selectedFiles
                });
  
                if (response.status === 200) {
                  showAlert('Contribution profile submitted successfully!');
                } else {
                  console.log('Unexpected response:', response);
                }
              }
            }
          ]
        );
      } else {
        const response = await api.post('/submitContributionProfile', {
          awardName, awardBody, date, selectedFiles
        });
  
        if (response.status === 200) {
          showAlert('Contribution profile submitted successfully!');
        } else {
          console.log('Unexpected response:', response);
        }
      }
    } catch (error) {
      console.error('Error in CONTRIBUTION submitting survey:', error);
      showAlert('Error submitting contribution profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await api.post('/submitSurvey', {
        name, permanentAdd, email, contactNum, mobileNum, civilStat, sex, birthday, region, province, residence,
  educationalAttain, professionalExams,  undergraduateReasons, graduateReasons,
  trainings, reasonAdvanceStud,
  presentlyEmployed, reasonUnemployed, presentEmployStat, skillsAcquired, presentOccupation, majorLine, placeOfWork, firstJobAfterJob, 
        reasonStayingJob, firstJobRelatedToCourse, reasonAcceptingJob, reasonChangingJob, durationFirstJob, howFindFirstJob, durationJobSeeking, firstJobLvl,
        secondJobLvl, earning, curriculumRelevance, competencies, suggestion, 
  awardName, awardBody, date, selectedFiles
      });
  
      if (response.status === 200) {
        // Handle success, e.g., show a success message or redirect the user
        console.log('Survey submitted successfully:', response.data);
      } else {
        // Handle unexpected status code
        console.log('Unexpected response:', response);
      }
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error('Error submitting survey:', error);
    }finally {
      setIsLoading(false);
    }
  };
  return (
    <LinearGradient
      colors={['rgb(255, 226, 226)', 'rgb(166, 213, 255)', '#192f6a']}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.linearGradient}
    >
    <ScrollView style={styles.container}>
      <View style={styles.logoCon}>
        <Image source={chedLogo} style={styles.logo} />
        <Image source={uaLogo} style={styles.logo} />
      </View>
      
      {/* GENERAL INFO */}
      <Text style={styles.title}>GRADUATE TRACER SURVEY (GTS)</Text>
      <Text style={styles.header}>A. GENERAL INFORMATION</Text>
      <Button title="Toggle General Information" color={'#1c1c1e'} onPress={() => toggleSection('general')} />
      {section === 'general' && (
        <View>
          <Text>Name</Text>
          <TextInput style={styles.input} placeholder="Name" value={name} editable={false} onChangeText={setName}/>
          <Text>Permanent Address</Text>
          <TextInput style={styles.input} editable={false} placeholder="Permanent Address" value={permanentAdd} onChangeText={setPermanentAdd} />
          <Text>Email Address</Text>
          <TextInput style={styles.input} editable={false} placeholder="Email Address" keyboardType="email-address" value={email} onChangeText={setEmailAdd} />
          <Text>Telephone or Contact Number(s)</Text>
          <TextInput style={styles.input} placeholder="Telephone or Contact Number(s)" keyboardType="phone-pad" value={contactNum} onChangeText={setContactNum} />
          <Text>Mobile Number</Text>
          <TextInput style={styles.input} placeholder="Mobile Number" keyboardType="phone-pad" value={mobileNum} onChangeText={setMobileNum} />
          <Text>Civil Status</Text>
          <Picker style={styles.picker} selectedValue={civilStat} onValueChange={setCivilStat}>
            <Picker.Item label="Single" value="Single" />
            <Picker.Item label="Separated" value="Separated" />
            <Picker.Item label="Widow or Widower" value="Widow" />
            <Picker.Item label="Married" value="Married" />
            <Picker.Item label="Single Parent" value="Single Parent" />
          </Picker>
          <Text>Sex</Text>
          <Picker style={styles.picker} selectedValue={sex} onValueChange={setSex}>
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
          <Text>Birthday</Text>

          {showDatePicker && (<DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            // mode={mode}
            disabled={true}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />)}
          
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            {console.log(birthday)}
            <TextInput style={{width: '90%', backgroundColor: 'white', padding: 10, borderRadius: 5}} 
              value={birthday} onChangeText={setBirthday} placeholder="YYYY-MM-DD" editable={false} keyboardType="number-pad" />
            <TouchableOpacity onPress={()=> setShowDatePicker(!showDatePicker)}>
              <FontAwesomeIcon icon={faCalendarPlus} size={20} />
            </TouchableOpacity>
            
          </View>
          <Text>Region of Origin</Text>
          <Picker style={styles.picker} selectedValue={region} onValueChange={setRegion}>
            {Array.from({ length: 12 }, (_, index) => (
              <Picker.Item 
                key={`region${index + 1}`} 
                label={`Region ${index + 1}`} 
                value={`Region ${index + 1}`} 
              />
            ))}
            <Picker.Item label="NCR" value="NCR" />
            <Picker.Item label="CAR" value="CAR" />
            <Picker.Item label="ARMM" value="ARMM" />
            <Picker.Item label="CARAGA" value="CARAGA" />


          </Picker>
          {/* <Text>Province</Text>
          <TextInput style={styles.input} placeholder="Province" value={province}  onChangeText={setProvince}/> */}

          <Text>Province</Text>
          <TextInput style={styles.input} placeholder="Province" value={province}  onChangeText={setProvince}/>
          <Text>Location of Residence</Text>
          <Picker style={styles.picker} selectedValue={residence} onValueChange={setResidence}>
            <Picker.Item label="City" value="city" />
            <Picker.Item label="Municipality" value="municipality" />
          </Picker>

          <TouchableOpacity style={styles.button} onPress={handleSubmitGenInfo} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Submit</Text>}
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.header}>B. EDUCATIONAL BACKGROUND</Text>
      <Button title="Toggle Educational Background" color={'#1c1c1e'} onPress={() => toggleSection('education')} />
      {section === 'education' && (
        <View>
          <Text>Educational Attainment (Baccalaureate Degree only)</Text>
          {educationalAttain.map((degree, index) => (
            <View key={index}>
              <TextInput
                style={styles.input}
                placeholder="Degree(s) & Specialization(s)"
                value={degree.degree}
                onChangeText={text => {
                  const newEducationalAttain = [...educationalAttain];
                  newEducationalAttain[index].degree = text;
                  setEducationalAttain(newEducationalAttain);
                }}
              />

              <TextInput
                style={styles.input}
                placeholder="College or University"
                value={degree.college}
                onChangeText={text => {
                  const newEducationalAttain = [...educationalAttain];
                  newEducationalAttain[index].college = text;
                  setEducationalAttain(newEducationalAttain);
                }}
              />

              <TextInput
                style={styles.input}
                placeholder="Year Graduated"
                value={degree.yearGrad}
                onChangeText={text => {
                  const newEducationalAttain = [...educationalAttain];
                  newEducationalAttain[index].yearGrad = text;
                  setEducationalAttain(newEducationalAttain);
                }}
              />

              <TextInput
                style={styles.input}
                placeholder="Honor(s) or Award(s) Received"
                value={degree.honor}
                onChangeText={text => {
                  const newEducationalAttain = [...educationalAttain];
                  newEducationalAttain[index].honor = text;
                  setEducationalAttain(newEducationalAttain);
                }}
              />
            </View>
          ))}
          
          <TouchableOpacity style={styles.button} onPress={addBaccalaureateDegree}>
            <Text style={styles.buttonText}>Add another Baccalaureate Degree</Text>
          </TouchableOpacity>

          <Text>Professional Examination(s) Passed</Text>
          {professionalExams.map((exam, index) => (
            <View key={index}>
              <TextInput style={styles.input} placeholder="Name of Examination" value={exam.name} onChangeText={(text) => {
                const newExams = [...professionalExams];
                newExams[index].name = text;
                setProfessionalExams(newExams);
              }} />
              <TextInput style={styles.input} placeholder="Date Taken YYYY-MM-DD" value={exam.date} onChangeText={(text) => {
                const newExams = [...professionalExams];
                newExams[index].date = text;
                setProfessionalExams(newExams);
              }} />
              <TextInput style={styles.input} placeholder="Rating" value={exam.rating} onChangeText={(text) => {
                const newExams = [...professionalExams];
                newExams[index].rating = text;
                setProfessionalExams(newExams);
              }} />
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={addProfessionalExam}>
            <Text style={styles.buttonText}>Add another Professional Examination</Text>
          </TouchableOpacity>
          <Text>Reason(s) for taking the course(s) or pursuing degree(s)</Text>
          <Text style={{fontWeight: "bold", fontSize: 15}}>Undergraduate/AB/BS</Text>
          <View>
            <Checkbox
              label="High grades in the course or subject area(s)"
              checked={undergraduateReasons.highGrades}
              onChange={() => handleUndergraduateReasonChange('highGrades')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Good grades in high school"
              checked={undergraduateReasons.goodGradesHS}
              onChange={() => handleUndergraduateReasonChange('goodGradesHS')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Influence of parents or relatives"
              checked={undergraduateReasons.parentInfluence}
              onChange={() => handleUndergraduateReasonChange('parentInfluence')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Peer Influence"
              checked={undergraduateReasons.peerInfluence}
              onChange={() => handleUndergraduateReasonChange('peerInfluence')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Inspired by a role model"
              checked={undergraduateReasons.roleModel}
              onChange={() => handleUndergraduateReasonChange('roleModel')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Strong passion for the profession"
              checked={undergraduateReasons.passionProfession}
              onChange={() => handleUndergraduateReasonChange('passionProfession')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Prospect for immediate employment"
              checked={undergraduateReasons.immediateEmployment}
              onChange={() => handleUndergraduateReasonChange('immediateEmployment')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Status or prestige of the profession"
              checked={undergraduateReasons.statusPrestige}
              onChange={() => handleUndergraduateReasonChange('statusPrestige')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Availability of course offering in chosen institution"
              checked={undergraduateReasons.courseAvailability}
              onChange={() => handleUndergraduateReasonChange('courseAvailability')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Prospect of career advancement"
              checked={undergraduateReasons.careerAdvancement}
              onChange={() => handleUndergraduateReasonChange('careerAdvancement')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Affordable for the family"
              checked={undergraduateReasons.affordableFamily}
              onChange={() => handleUndergraduateReasonChange('affordableFamily')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Prospect of attractive compensation"
              checked={undergraduateReasons.attractiveCompensation}
              onChange={() => handleUndergraduateReasonChange('attractiveCompensation')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Opportunity for employment abroad"
              checked={undergraduateReasons.employmentAbroad}
              onChange={() => handleUndergraduateReasonChange('employmentAbroad')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="No particular choice or no better idea"
              checked={undergraduateReasons.noParticularChoice}
              onChange={() => handleUndergraduateReasonChange('noParticularChoice')}
              labelStyle={styles.checkboxTxt}
            />
          </View>
          <Text style={{fontWeight: "bold", fontSize: 15}}>Graduate/MS/MA/PhD</Text>
          <View>
            <Checkbox
              label="High grades in the course or subject area(s)"
              checked={graduateReasons.highGrades}
              onChange={() => handleGraduateReasonChange('highGrades')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Good grades in high school"
              checked={graduateReasons.goodGradesHS}
              onChange={() => handleGraduateReasonChange('goodGradesHS')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Influence of parents or relatives"
              checked={graduateReasons.parentInfluence}
              onChange={() => handleGraduateReasonChange('parentInfluence')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Peer Influence"
              checked={graduateReasons.peerInfluence}
              onChange={() => handleGraduateReasonChange('peerInfluence')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Inspired by a role model"
              checked={graduateReasons.roleModel}
              onChange={() => handleGraduateReasonChange('roleModel')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Strong passion for the profession"
              checked={graduateReasons.passionProfession}
              onChange={() => handleGraduateReasonChange('passionProfession')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Prospect for immediate employment"
              checked={graduateReasons.immediateEmployment}
              onChange={() => handleGraduateReasonChange('immediateEmployment')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Status or prestige of the profession"
              checked={graduateReasons.statusPrestige}
              onChange={() => handleGraduateReasonChange('statusPrestige')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Availability of course offering in chosen institution"
              checked={graduateReasons.courseAvailability}
              onChange={() => handleGraduateReasonChange('courseAvailability')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Prospect of career advancement"
              checked={graduateReasons.careerAdvancement}
              onChange={() => handleGraduateReasonChange('careerAdvancement')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Affordable for the family"
              checked={graduateReasons.affordableFamily}
              onChange={() => handleGraduateReasonChange('affordableFamily')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Prospect of attractive compensation"
              checked={graduateReasons.attractiveCompensation}
              onChange={() => handleGraduateReasonChange('attractiveCompensation')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="Opportunity for employment abroad"
              checked={graduateReasons.employmentAbroad}
              onChange={() => handleGraduateReasonChange('employmentAbroad')}
              labelStyle={styles.checkboxTxt}
            />
            <Checkbox
              label="No particular choice or no better idea"
              checked={graduateReasons.noParticularChoice}
              onChange={() => handleGraduateReasonChange('noParticularChoice')}
              labelStyle={styles.checkboxTxt}
            />
            
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmitEducBack} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Submit</Text>}
          </TouchableOpacity>
        </View>
      )}
      


      {/* TRAININGS */}
      <Text style={styles.header}>C. TRAINING(S)/ADVANCE STUDIES ATTENDED AFTER COLLEGE</Text>
      <Button title="Toggle Training/Advance Studies" color={'#1c1c1e'} onPress={() => toggleSection('training')} />
      {section === 'training' && (
        <View>
          <Text>Please list down all professional or work-related training program(s) including advance studies you have attended after college. </Text>

          {trainings.map((training, index) => (
            <View key={index}>
              <Text>Title of Training or Advance Study</Text>
              <TextInput style={styles.input} placeholder="Title" value={training.title} onChangeText={(text) => {
                const newTrainings = [...trainings];
                newTrainings[index].title = text;
                setTrainings(newTrainings);
              }} />
              <Text>Duration and Credits Earned</Text>
              <TextInput style={styles.input} placeholder="Duration and Credits" value={training.duration} onChangeText={(text) => {
                const newTrainings = [...trainings];
                newTrainings[index].duration = text;
                setTrainings(newTrainings);
              }} />
              <Text>Name of Training Institution/College/University</Text>
              <TextInput style={styles.input} placeholder="Institution/College/University" value={training.institution} onChangeText={(text) => {
                const newTrainings = [...trainings];
                newTrainings[index].institution = text;
                setTrainings(newTrainings);
              }} />
              
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={addTraining}>
            <Text style={styles.buttonText}>Add another Training or Advance Study</Text>
          </TouchableOpacity>
          <Text>What made you pursue advance studies?</Text>
          <Picker style={styles.picker} selectedValue={reasonAdvanceStud} onValueChange={setReasonAdvanceStud}>
            <Picker.Item label="For promotion" value="For promotion" />
            <Picker.Item label="For professional development" value="For professional development" />
          </Picker>

          <TouchableOpacity style={styles.button} onPress={handleSubmitTraining} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Submit</Text>}
          </TouchableOpacity>
        </View>
      )}
      
      {/* EMPLOYMENT */}
      <Text style={styles.header}>D. EMPLOYMENT DATA</Text>
      <Button title="Toggle Employment Data" color={'#1c1c1e'} onPress={() => toggleSection('employment')} />
      {section === 'employment' && (
        <View>
          <Text>Are you presently employed?</Text>
          <Picker style={styles.picker} selectedValue={presentlyEmployed} onValueChange={setPresentlyEmployed} >
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
            <Picker.Item label="Never Employed" value="Never Employed" />
          </Picker>
          
          {/* Employment questions for those not employed */}
          <View>
            <Text>Please state reason(s) why you are not yet employed. You may check more than one answer.</Text>
            <View style={styles.checkboxContainer}>
              <Checkbox  label={"Advance or further study"} labelStyle={styles.checkboxTxt} onChange={() => handleReasonUnemployedChange('advanceStudy')}/>
              <Checkbox  label={"Family concern and decided not to find a job"} labelStyle={styles.checkboxTxt} onChange={() => handleReasonUnemployedChange('familyConcern')}/>
              <Checkbox  label={"Health-related reason(s)"} labelStyle={styles.checkboxTxt} onChange={() => handleReasonUnemployedChange('health')}/>
              <Checkbox  label={"Lack of work experience"} labelStyle={styles.checkboxTxt} onChange={() => handleReasonUnemployedChange('lackWorkExp')}/>
              <Checkbox  label={"No job opportunity"} labelStyle={styles.checkboxTxt} onChange={() => handleReasonUnemployedChange('noJobOp')}/>
              <Checkbox  label={"Did not look for a job"} labelStyle={styles.checkboxTxt} onChange={() => handleReasonUnemployedChange('notLookJob')}/>
            </View>
          </View>
          {/* Employment questions for those employed */}
          <View>
            <Text>Present Employment Status</Text>
            <Picker style={styles.picker} selectedValue={presentEmployStat} onValueChange={setPresentEmployStat}>
              <Picker.Item label="Regular or Permanent" value="Regular or Permanent" />
              <Picker.Item label="Contractual" value="Contractual" />
              <Picker.Item label="Temporary" value="Temporary" />
              <Picker.Item label="Self-employed" value="Self-employed" />
            </Picker>

            <Text>If self-employed, what skills acquired in college were you able to apply in your work?</Text>
            <TextInput style={styles.input} value={skillsAcquired} onChangeText={setSkillsAcquired}/>
            <Text>Present occupation (Ex. Grade School Teacher, Electrical Engineer, Self-employed)</Text>
            <TextInput style={styles.input} value={presentOccupation} onChangeText={setPresentOccupation} />
            <Text>Major line of business of the company you are presently employed in. Check one only.</Text>
            <Picker style={styles.picker} selectedValue={majorLine} onValueChange={setMajorLine}>
              <Picker.Item label="Agriculture, Hunting and Forestry" value="agriculture" />
              <Picker.Item label="Fishing" value="fishing" />
              <Picker.Item label="Mining and Quarrying" value="mining" />
              <Picker.Item label="Manufacturing" value="manufacturing" />
              <Picker.Item label="Electricity, Gas and Water Supply" value="utilities" />
              <Picker.Item label="Construction" value="construction" />
              <Picker.Item label="Wholesale and Retail Trade" value="trade" />
              <Picker.Item label="Hotels and Restaurants" value="hospitality" />
              <Picker.Item label="Transport Storage and Communication" value="transport" />
              <Picker.Item label="Financial Intermediation" value="finance" />
              <Picker.Item label="Real Estate, Renting and Business Activities" value="real_estate" />
              <Picker.Item label="Public Administration and Defense" value="public_administration" />
              <Picker.Item label="Education" value="education" />
              <Picker.Item label="Health and Social Work" value="health" />
              <Picker.Item label="Other Community, Social and Personal Service Activities" value="other_services" />
              <Picker.Item label="Private Households with Employed Persons" value="private_households" />
              <Picker.Item label="Extra-territorial Organizations and Bodies" value="extra_territorial" />
            </Picker>
            <Text>Place of work</Text>
            <Picker style={styles.picker} selectedValue={placeOfWork} onValueChange={setPlaceOfWork} >
              <Picker.Item label="Local" value="local" />
              <Picker.Item label="Abroad" value="abroad" />
            </Picker>
            <Text>Is this your first job after college?</Text>
            <Picker style={styles.picker} selectedValue={firstJobAfterJob} onValueChange={setFirstJobAfterJob}>
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
            </Picker>
          </View>

          <View>
            <Text>What are your reason(s) for staying on the job? You may check (✔) more than one answer.</Text>
            <Checkbox  label={"Salaries and benefits"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonStayingJobChange('salaries')}/>
            <Checkbox  label={"Career challenge"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonStayingJobChange('careerChallenge')}/>
            <Checkbox  label={"Related to special skill"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonStayingJobChange('specialSkill')}/>
            <Checkbox  label={"Related to course or program of study"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonStayingJobChange('relatedToCourse')}/>
            <Checkbox  label={"Proximity to residence"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonStayingJobChange('proximityToResidence')}/>
            <Checkbox  label={"Peer influence"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonStayingJobChange('peerInfluence')}/>
            <Checkbox  label={"Family influence"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonStayingJobChange('familyInfluence')}/>

          </View>
          <View>
            <Text>Is your first job related to the course you took up in college?</Text>
            <Picker style={styles.picker} selectedValue={firstJobRelatedToCourse} onValueChange={setFirstJobRelatedToCourse}>
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker>
            
          </View>
          {/* // 24. What were your reasons for accepting the job? You may check () more than one answer. */}
          <Text>What were your reasons for accepting the job?  You may check (✔) more than one answer.</Text>
          <Checkbox  label={"Salaries & benefits"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonAcceptingJobChange('salaries')}/>
          <Checkbox  label={"Career challenge"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonAcceptingJobChange('careerChallenge')}/>
          <Checkbox  label={"Related to special skills"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonAcceptingJobChange('relatedToCourse')}/>
          <Checkbox  label={"Proximity to residence"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonAcceptingJobChange('proximityToResidence')}/>

          {/* // 25. What were your reason(s) for changing job? You may check () more than one answer. */}
          <Text>What were your reason(s) for changing job? You may check (✔) more than one answer.</Text>
          <Checkbox  label={"Salaries & benefits"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonChangingJobChange('salaries')}/>
          <Checkbox  label={"Career challenge"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonChangingJobChange('careerChallenge')}/>
          <Checkbox  label={"Related to special skills"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonChangingJobChange('relatedToCourse')}/>
          <Checkbox  label={"Proximity to residence"} labelStyle={styles.checkboxTxt} onChange={()=> handleReasonChangingJobChange('proximityToResidence')}/>

          {/* // 27. How long did you stay in your first job? */}
          <Text>How long did you stay in your first job?  </Text>
          <Picker
            style={styles.picker} selectedValue={durationFirstJob} onValueChange={setDurationFirstJob}
          >
            <Picker.Item label="Less than a month" value="Less than a month" />
            <Picker.Item label="1 to 6 months" value="1 to 6 months" />
            <Picker.Item label="7 to 11 months" value="7 to 11 months" />
            <Picker.Item label="1 year to less than 2 years" value="1 year to less than 2 years" />
            <Picker.Item label="2 years to less than 3 years" value="2 years to less than 3 years" />
            <Picker.Item label="3 years to less than 4 years" value="3 years to less than 4 years" />
            <Picker.Item label="Others, please specify" value="Others" />
          </Picker>


          <Text>How did you find your first job?</Text>
          <Checkbox  label={"Response to an advertisement"} labelStyle={styles.checkboxTxt} onChange={()=> handleHowFindFirstJobChange('advertisement')} />
          <Checkbox  label={"Arranged by school’s job placement officer"} labelStyle={styles.checkboxTxt}  onChange={()=> handleHowFindFirstJobChange('schoolplacement')}/>
          <Checkbox  label={"As walk-in applicant"} labelStyle={styles.checkboxTxt}  onChange={()=> handleHowFindFirstJobChange('walkin')}/>
          <Checkbox  label={"Family business"} labelStyle={styles.checkboxTxt}  onChange={()=> handleHowFindFirstJobChange('familybusiness')}/>
          <Checkbox  label={"Recommended by someone"} labelStyle={styles.checkboxTxt}  onChange={()=> handleHowFindFirstJobChange('reco')}/>
          <Checkbox  label={"Job Fair or Public Employment Service Office (PESO)"} labelStyle={styles.checkboxTxt}  onChange={()=> handleHowFindFirstJobChange('jobfair')}/>


          <Text>How long did it take you to land your first job? </Text>
          <Picker
            style={styles.picker} selectedValue={durationJobSeeking} onValueChange={setDurationJobSeeking}
          >
            <Picker.Item label="Less than a month" value="Less than a month" />
            <Picker.Item label="1 to 6 months" value="1 to 6 months" />
            <Picker.Item label="7 to 11 months" value="7 to 11 months" />
            <Picker.Item label="1 year to less than 2 years" value="1 year to less than 2 years" />
            <Picker.Item label="2 years to less than 3 years" value="2 years to less than 3 years" />
            <Picker.Item label="3 years to less than 4 years" value="3 years to less than 4 years" />
            <Picker.Item label="Others, please specify" value="Others" />
          </Picker>

          <Text>Job Level  (First Job) </Text>
          <Picker
            style={styles.picker} selectedValue={firstJobLvl} onValueChange={setFirstJobLvl}
          >
            <Picker.Item label="Rank or Clerical" value="Rank or Clerical" />
            <Picker.Item label="Professional, Technical or Supervisory" value="Professional, Technical or Supervisory" />
            <Picker.Item label="Managerial or Executive" value="Managerial or Executive" />
            <Picker.Item label="Self-employed" value="Self-employed" />

          </Picker>
          <Text>Job Level  (Current or Second Job) </Text>
          <Picker
            style={styles.picker} selectedValue={secondJobLvl} onValueChange={setSecondJobLvl}
          >
            <Picker.Item label="Rank or Clerical" value="Rank or Clerical" />
            <Picker.Item label="Professional, Technical or Supervisory" value="Professional, Technical or Supervisory" />
            <Picker.Item label="Managerial or Executive" value="Managerial or Executive" />
            <Picker.Item label="Self-employed" value="Self-employed" />

          </Picker>
          
          <Text>What is your initial gross monthly earning in your first job after college?</Text>
          <Picker
            style={styles.picker} selectedValue={earning} onValueChange={setEarning}
          >
            <Picker.Item label="Below P5,000.00" value="Below P5,000.00" />
            <Picker.Item label="P5,000.00 to less than P10,000.00" value="P5,000.00 to less than P10,000.00" />
            <Picker.Item label="P10,000.00 to less than P15,000.00" value="P10,000.00 to less than P15,000.00" />
            <Picker.Item label="P15,000.00 to less than P20,000.00" value="P15,000.00 to less than P20,000.00" />
            <Picker.Item label="P20,000.00 to less than P25,000.00" value="P20,000.00 to less than P25,000.00" />
            <Picker.Item label="P25,000.00 and above" value="P25,000.00 and above" />

          </Picker>

          <Text>Was the curriculum you had in college relevant to your first job?</Text>
          <Picker
            style={styles.picker} selectedValue={curriculumRelevance} onValueChange={setCurriculumRelevance}
          >
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
          </Picker>

          <Text>If YES, what competencies learned in college did you find very useful in your first job?  You may   check (✔) more than one answer.</Text>
          {console.log(competencies)}
          <Checkbox  label={"Communication skills"} labelStyle={styles.checkboxTxt} onChange={()=> handleCompetenciesChange('communication')} />
          <Checkbox  label={"Human Relations skills"} labelStyle={styles.checkboxTxt} onChange={()=> handleCompetenciesChange('humanrelation')} />
          <Checkbox  label={"Entrepreneurial skills"} labelStyle={styles.checkboxTxt} onChange={()=> handleCompetenciesChange('entrepreneurial')} />
          <Checkbox  label={"Information Technology skills"} labelStyle={styles.checkboxTxt} onChange={()=> handleCompetenciesChange('informationtech')} />
          <Checkbox  label={"Problem-solving skills"} labelStyle={styles.checkboxTxt} onChange={()=> handleCompetenciesChange('problemsolving')} />
          <Checkbox  label={"Critical Thinking skills"} labelStyle={styles.checkboxTxt}onChange={()=> handleCompetenciesChange('criticalthinking')} />
          
          <Text>List down suggestions to further improve your course curriculum.</Text>
          <TextInput style={styles.input} value={suggestion} onChangeText={setSuggestion} />

          <TouchableOpacity style={styles.button} onPress={handleSubmitEmployment} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Submit</Text>}
          </TouchableOpacity>
        </View>
      )}
      
      {/* CONTRIBUTION */}
      <Text style={styles.header}>E. CONTRIBUTION DATA</Text>
      <Button title="Toggle Contribution Data" color={'#1c1c1e'} onPress={() => toggleSection('contribution')} />
      {section === 'contribution' && (
        <View>
          <Text>Award Name</Text>
          <TextInput style={styles.input} value={awardName} onChangeText={setAwardName} />

          <Text>Awarding Body</Text>
          <TextInput style={styles.input} value={awardBody} onChangeText={setAwardBody} />

          <Text>Date</Text>
          {showDatePicker && (<DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            // mode={mode}
            is24Hour={true}
            display="default"
            onChange={setAwardDate}
          />)}
          
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
            {console.log(date)}
            {console.log("bday", birthday)}
            <TextInput style={{width: '90%', backgroundColor: 'white', padding: 10, borderRadius: 5}} 
              value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" keyboardType="number-pad" />
            <TouchableOpacity onPress={()=> setShowDatePicker(!showDatePicker)}>
              <FontAwesomeIcon icon={faCalendarPlus} size={20} />
            </TouchableOpacity>
            
          </View>

          {/* <Text>Certificate</Text>
          <TouchableOpacity style={styles.fileButton} onPress={handleSelectImage}>
            <FontAwesomeIcon icon={faImage} size={18} color="#000" />
            <Text style={styles.fileButtonText}>Add Photo</Text>
          </TouchableOpacity>
          <View style={styles.filePreviewContainer}>
            {selectedFiles.map((file, index) => (
              <View key={index} style={styles.previewContainer}>
                {file.type === 'success' ? (
                  <Text>{file.name}</Text>
                ) : (
                  <Image source={{ uri: file.uri }} style={styles.previewImage} />
                )}
                <TouchableOpacity
                  style={styles.removeFileButton}
                  onPress={() => handleRemoveFile(file.uri)}
                >
                  <FontAwesomeIcon icon={faX} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
 */}
          <TouchableOpacity style={styles.button} onPress={handleSubmitContribution} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Submit</Text>}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  
  
  logo: {
    width: 100,
    height: 100,
    marginHorizontal: 10, // Add some horizontal margin between logos
    borderRadius: 50,
  },
  logoCon: {
    flexDirection: 'row',
    justifyContent: 'center', // Center logos horizontally
    alignItems: 'center',
    marginBottom: 20, // Add some margin below the logos
  },
  container: {
    flex: 1,
    // padding: 20,
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Center text horizontally
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  picker: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1c1c1e',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
  },
  checkboxTxt:{
    color:"black",
    fontSize: 14,
  },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  previewContainer: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeFileButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
    padding: 5,
  },
});

export default GraduateTracerSurvey;
