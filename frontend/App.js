import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 4.6097,
          longitude: -74.0817,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: 4.6097, longitude: -74.0817 }}
          title={"Punto HighMaps"}
          description={"Zona de prueba en Bogotá"}
        />
      </MapView>

      <View style={styles.overlay}>
        <Text style={styles.title}>HighMaps 🌿</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 20,
  },
  title: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 18,
  },
});