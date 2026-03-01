import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [mySpots, setMySpots] = useState([
    { id: 1, title: "Zona Rosa", coords: { latitude: 4.6670, longitude: -74.0550 }, security: "Alta" },
  ]);

  const addCurrentLocation = () => {
    Alert.alert("HighMaps", "¡Punto guardado con éxito! 🌿");
    // Aquí luego programaremos que guarde la coordenada real del GPS
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 4.6300, longitude: -74.0700,
          latitudeDelta: 0.1, longitudeDelta: 0.1,
        }}
      >
        {mySpots.map(spot => (
          <Marker key={spot.id} coordinate={spot.coords} onPress={() => setSelectedSpot(spot)}>
            <Text style={{fontSize: 30}}>🌿</Text>
          </Marker>
        ))}
      </MapView>

      {/* Botón flotante para añadir */}
      <TouchableOpacity style={styles.fab} onPress={addCurrentLocation}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {selectedSpot && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{selectedSpot.title}</Text>
          <TouchableOpacity onPress={() => setSelectedSpot(null)} style={styles.closeBtn}>
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
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  fabIcon: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  card: { position: 'absolute', bottom: 100, left: 20, right: 20, backgroundColor: '#1E1E1E', padding: 20, borderRadius: 20 },
  cardTitle: { color: '#4CAF50', fontSize: 18, fontWeight: 'bold' },
  closeBtn: { marginTop: 10, backgroundColor: '#333', padding: 8, borderRadius: 10, alignItems: 'center' }
});