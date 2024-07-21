import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const ALGOLIA_APP_ID = 'EFTPWHJF5O';
const ALGOLIA_API_KEY = '82286832d9d214af05610d4b4a883306';

const AlgoliaPlacesAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      fetchPlaces(query);
    } else {
      setResults([]);
    }
  }, [query]);

  const fetchPlaces = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://places-dsn.algolia.net/1/places/query', {
        params: {
          query,
          type: 'address',
        },
        headers: {
          'X-Algolia-Application-Id': ALGOLIA_APP_ID,
          'X-Algolia-API-Key': ALGOLIA_API_KEY,
        },
      });
      setResults(response.data.hits);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type an address"
        value={query}
        onChangeText={setQuery}
      />
      {isLoading && <Text>Loading...</Text>}
      <FlatList
        data={results}
        keyExtractor={(item) => item.objectID}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelect(item)}>
            <Text style={styles.item}>{item.locale_names.default[0]}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default AlgoliaPlacesAutocomplete;
