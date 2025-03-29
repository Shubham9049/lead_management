import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';

const ApplicationReviewScreen = () => {
  const [applicationNumber, setApplicationNumber] = useState('');
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchApplicationData = () => {
    if (!applicationNumber.trim()) {
      setError('Please enter an application number.');
      return;
    }

    setLoading(true);
    setError('');
    setApplicationData(null);

    axios
      .post('https://app.bigwigmedia.in/ApplicationApi.php', { application_number: applicationNumber })
      .then((response) => {
        setApplicationData(response.data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching application data:', error);
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Application Review</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Application Number"
        placeholderTextColor="#666"
        value={applicationNumber}
        onChangeText={setApplicationNumber}
      />

      <TouchableOpacity style={styles.button} onPress={fetchApplicationData}>
        <Text style={styles.buttonText}>Fetch Application</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#D17A47" style={styles.loader} />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {applicationData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Application Details</Text>
          {[ 
            { label: 'ID', key: 'Student ID' },
            { label: 'Name', key: 'Student Name' },
            { label: 'Email', key: 'Email' },
            { label: 'Mobile', key: 'Mobile Number' },
            { label: 'Status', key: 'Status' },
            { label: 'Lead Source', key: 'Lead Source' },
            { label: 'Lead Status', key: 'Lead Status' },
            { label: 'Reg. Date', key: 'Registration Date' },
            { label: 'Programme', key: 'Programme Name' }
          ].map(({ label, key }) => (
            <Text key={key} style={styles.cardText}>
              <Text style={styles.label}>{label}:</Text> {applicationData[key]}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default ApplicationReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D17A47',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    color: '#333',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D17A47',
  },
  button: {
    backgroundColor: '#D17A47',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loader: {
    marginVertical: 15,
  },
  errorText: {
    color: '#D9534F',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FAFAFA',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#D17A47',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D17A47',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#D17A47',
  },
});
