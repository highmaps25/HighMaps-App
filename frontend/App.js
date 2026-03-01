import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [selectedSpot, setSelectedSpot] = useState(null);

  const handleReport = () => {
    Alert.alert(
      "Nuevo Reporte HighMaps",
      "¿Qué quieres reportar en tu ubicación actual?",
      [
        { text: "🌿 Todo Relax", onPress: () => Alert.alert("¡Gracias!", "Spot marcado como seguro.") },
        { text: "👮 Presencia Policial", onPress: () => Alert.alert("⚠️ Aviso", "Alerta enviada a la comunidad."), style: "destructive" },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 4.6300, longitude: -74.0700,
          latitudeDelta: 0.05, longitudeDelta: 0.05,
        }}
      >
        {/* Un pin de ejemplo en Chapinero */}
        <Marker 
          coordinate={{ latitude: 4.6480, longitude: -74.0600 }}
          onPress={() => setSelectedSpot({title: "Chapinero Alto", info: "Ambiente relax, cerca a parques."})}
        >
          <Text style={{fontSize: 30}}>🌿</Text>
        </Marker>
      </MapView>

      {/* Título de la App */}
      <View style={styles.header}>
        <Text style={styles.headerText}>HighMaps 🌿</Text>
      </View>

      {/* Botón de Reporte (El "+" de abajo) */}
      <TouchableOpacity style={styles.fab} onPress={handleReport}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Tarjeta informativa cuando tocas un pin */}
      {selectedSpot && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>{selectedSpot.title}</Text>
          <Text style={styles.cardSub}>{selectedSpot.info}</Text>
          <TouchableOpacity onPress={() => setSelectedSpot(null)} style={styles.closeBtn}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>CERRAR</Text>
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
    position: 'absolute', top: 50, alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)', padding: 12, borderRadius: 25,
    borderWidth: 1, borderColor: '#4CAF50'
  },
  headerText: { color: '#4CAF50', fontWeight: 'bold', fontSize: 18 },
  fab: {
    position: 'absolute', bottom: 30, right: 30,
    backgroundColor: '#4CAF50', width: 65, height: 65, borderRadius: 33,
    justifyContent: 'center', alignItems: 'center', elevation: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3
  },
  fabIcon: { color: 'white', fontSize: 40, marginTop: -5 },
  infoCard: {
    position: 'absolute', bottom: 110, left: 20, right: 20,
    backgroundColor: '#1A1A1A', padding: 20, borderRadius: 20,
    borderLeftWidth: 5, borderLeftColor: '#4CAF50'
  },
  cardTitle: { color: '#4CAF50', fontSize: 20, fontWeight: 'bold' },
  cardSub: { color: 'white', marginTop: 5, opacity: 0.8 },
  closeBtn: { marginTop: 15, backgroundColor: '#333', padding: 10, borderRadius: 10, alignItems: 'center' }
});