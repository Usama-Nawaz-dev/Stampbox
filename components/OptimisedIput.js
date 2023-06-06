import React, { useState, useEffect, useRef } from "react";

// import { useState, useEffect, useRef } from "react";
import { Image, Text, TextInput, View } from "react-native";
// Usage
export function OptimisedInput() {
  // State and setters for ...
  // Search term
  const [searchTerm, setSearchTerm] = useState("");
  // API search results
  const [results, setResults] = useState([]);
  // Searching status (whether there is pending API request)
  const [isSearching, setIsSearching] = useState(false);
  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 500ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  // Effect for API call
  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        searchCharacters(debouncedSearchTerm).then((results) => {
          setIsSearching(false);
          setResults(results);
        });
      } else {
        setResults([]);
        setIsSearching(false);
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );
  return (
    <View>
      <TextInput
        style={{
          fontSize: 18,
          alignself: "self",
          color: "black",
          marginHorizontal: 10,
          width: '90%'
          // marginBottom: 30,
        }}
        placeholder="Search Marvel Comics"
        onChangeText={val => setSearchTerm(val)}
      />
      {isSearching && <Text>Searching ...</Text>}
      {results.map((result) => (
        <View key={result.id}>
          <Text>{result.title}</Text>
          <Image
            source={`${result.thumbnail.path}/portrait_incredible.${result.thumbnail.extension}`}
          />
        </View>
      ))}
    </View>
  );
}
// API search function
function searchCharacters(search) {
  const apiKey = "f9dfb1e8d466d36c27850bedd2047687";
  return fetch(
    `https://gateway.marvel.com/v1/public/comics?apikey=f9dfb1e8d466d36c27850bedd2047687&titleStartsWith=${search}`,
    {
      method: "GET",
    }
  )
    .then((r) => r.json())
    .then((r) => r.data.results)
    .catch((error) => {
      console.error(error);
      return [];
    });
}
// Hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}
// export OptimisedInput;
