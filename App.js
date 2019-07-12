//ignore this. it came from the react-native version of create-react boilerplate and i need to delete but last time i tried it ruined my bundling or something so now i'm too scared, but i rerouted my main/entry to the App.js in my components directory so i should be fine to delete this but you know. i have fears.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>is this refreshing???</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
