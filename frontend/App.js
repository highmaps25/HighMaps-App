import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // <--- Importamos el GPS

// --- ESTILO JSON (El que ya te gustó) ---
const mapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#1b5e20" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

export default function App() {
  const [location, setLocation] = useState(null);

  // 1. PEDIR PERMISO DE GPS AL ABRIR LA APP
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Error", "Necesitamos GPS para HighMaps 🌿");
        return;
      }
      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    })();
  }, []);

  // 2. FUNCIÓN PARA REPORTAR (Ahora usa tu ubicación real)
  const handleReport = async () => {
    let currentPos = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = currentPos.coords;
    
    Alert.alert(
      "Reporte HighMaps 🌿",
      `Punto registrado en:\nLat: ${latitude.toFixed(4)}\nLong: ${longitude.toFixed(4)}`,
      [{ text: "¡Firme!", style: "default" }]
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        customMapStyle={mapStyle}
        showsUserLocation={true}       // <--- AQUÍ APARECE EL PUNTO AZUL
        followsUserLocation={true}     // <--- EL MAPA TE SIGUE
        showsMyLocationButton={true}   // <--- BOTÓN DE CENTRAR
        initialRegion={{
          latitude: 4.6300, longitude: -74.0700,
          latitudeDelta: 0.02, longitudeDelta: 0.02,
        }}
      >
        {/* Marcador de prueba en Chapinero */}
        <Marker coordinate={{ latitude: 4.6480, longitude: -74.0600 }}>
          <Text style={{fontSize: 30}}>🌿</Text>
        </Marker>
      </MapView>

      <View style={styles.header}>
        <Text style={styles.headerText}>HighMaps Bogotá 🌿</Text>
      </View>

      <TouchableOpacity style={styles.fab} onPress={handleReport}>
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
    backgroundColor: 'rgba(0,0,0,0.85)', padding: 15, borderRadius: 30,
    borderWidth: 1, borderColor: '#4CAF50', elevation: 5
  },
  headerText: { color: '#4CAF50', fontWeight: 'bold', fontSize: 18 },
  fab: {
    position: 'absolute', bottom: 40, right: 30,
    backgroundColor: '#1b5e20', width: 65, height: 65, borderRadius: 33,
    justifyContent: 'center', alignItems: 'center', elevation: 10,
    borderWidth: 2, borderColor: '#4CAF50'
  },
  fabIcon: { color: 'white', fontSize: 40, marginTop: -5 }
});