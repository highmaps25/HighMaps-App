import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const highSpots = [
  { id: 1, title: "Zona Rosa", coords: { latitude: 4.6670, longitude: -74.0550 }, security: "Alta", tip: "Mucho flujo de gente, zona segura." },
  { id: 2, title: "Chapinero Alto", coords: { latitude: 4.6480, longitude: -74.0600 }, security: "Media", tip: "Ojo en calles oscuras después de las 10pm." },
  { id: 3, title: "La Candelaria", coords: { latitude: 4.5980, longitude: -74.0760 }, security: "Media-Baja", tip: "Mantente en las vías principales." },
];

export default function App() {
  const [selectedSpot, setSelectedSpot] = useState(null);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true} // Muestra tu punto azul
        initialRegion={{
          latitude: 4.6300,
          longitude: -74.0700,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {highSpots.map(spot => (
          <Marker
            key={spot.id}
            coordinate={spot.coords}
            onPress={() => setSelectedSpot(spot)}
          >
            <Text style={{fontSize: 30}}>🌿</Text>
          </Marker>
        ))}
      </MapView>

      {/* Título Superior */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HighMaps Bogotá</Text>
      </View>

      {/* Tarjeta de Información (Solo aparece al tocar un spot) */}
      {selectedSpot && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{selectedSpot.title}</Text>
          <Text style={styles.cardText}>🛡️ Seguridad: <Text style={{fontWeight: 'bold'}}>{selectedSpot.security}</Text></Text>
          <Text style={styles.cardText}>💡 Tip: {selectedSpot.tip}</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedSpot(null)}
          >
            <Text style={{color: 'white'}}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject },
  header: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(20, 30, 20, 0.9)',
    padding: 15,
    borderRadius: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  headerTitle: { color: '#4CAF50', fontWeight: 'bold', fontSize: 18 },
  card: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 20,
    borderTopWidth: 4,
    borderTopColor: '#4CAF50',
    elevation: 10,
  },
  cardTitle: { color: '#4CAF50', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  cardText: { color: 'white', fontSize: 14, marginBottom: 5 },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center'
  }
});