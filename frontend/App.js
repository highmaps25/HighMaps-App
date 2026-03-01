import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// --- DEFINIMOS EL ESTILO OSCURO ---
const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#1b5e20" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true); // <--- CONTROL DEL MODO
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        // SI isDarkMode es true, usa el JSON. SI ES false, usa null (Mapa normal)
        customMapStyle={isDarkMode ? darkMapStyle : []} 
        showsUserLocation={true}
        initialRegion={{
          latitude: 4.6300, longitude: -74.0700,
          latitudeDelta: 0.05, longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: 4.6480, longitude: -74.0600 }}>
          <Text style={{fontSize: 30}}>🌿</Text>
        </Marker>
      </MapView>

      {/* TÍTULO DINÁMICO SEGÚN EL MODO */}
      <View style={[styles.header, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)' }]}>
        <Text style={[styles.headerText, { color: isDarkMode ? '#4CAF50' : '#2E7D32' }]}>
          HighMaps {isDarkMode ? '🌙' : '☀️'}
        </Text>
      </View>

      {/* BOTÓN PARA CAMBIAR EL MODO (DARK/LIGHT) */}
      <TouchableOpacity 
        style={[styles.modeButton, { backgroundColor: isDarkMode ? '#FFF' : '#212121' }]} 
        onPress={() => setIsDarkMode(!isDarkMode)}
      >
        <Text style={{ fontSize: 20 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>

      {/* BOTÓN DE REPORTAR (EL QUE YA TENÍAS) */}
      <TouchableOpacity style={styles.fab} onPress={() => Alert.alert("HighMaps", "¡Reporte enviado!")}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject },
  header: {
    position: 'absolute', top: 50, alignSelf: 'center',
    padding: 12, borderRadius: 25, borderWidth: 1, borderColor: '#4CAF50'
  },
  headerText: { fontWeight: 'bold', fontSize: 16 },
  modeButton: {
    position: 'absolute', top: 50, right: 20,
    width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.3
  },
  fab: {
    position: 'absolute', bottom: 40, right: 30,
    backgroundColor: '#1b5e20', width: 65, height: 65, borderRadius: 33,
    justifyContent: 'center', alignItems: 'center', elevation: 10,
    borderWidth: 2, borderColor: '#4CAF50'
  },
  fabIcon: { color: 'white', fontSize: 40, marginTop: -5 }
});