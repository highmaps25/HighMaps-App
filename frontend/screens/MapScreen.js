import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function App() {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSpotName, setNewSpotName] = useState('');
  
  const [spots, setSpots] = useState([
    { id: 1, title: "Zona Rosa", coords: { latitude: 4.6670, longitude: -74.0550 }, security: "Alta", tip: "Mucho flujo de gente." },
    { id: 2, title: "Chapinero Alto", coords: { latitude: 4.6480, longitude: -74.0600 }, security: "Media", tip: "Ojo después de las 10pm." },
  ]);

  const saveNewSpot = () => {
    if (newSpotName.trim().length === 0) {
      Alert.alert("Error", "Ponle un nombre al spot 🌿");
      return;
    }
    const newSpot = {
      id: Date.now(),
      title: newSpotName,
      coords: { latitude: 4.6300, longitude: -74.0700 }, // Aquí se podría captar tu GPS real
      security: "Reciente",
      tip: "Añadido por la comunidad HighMaps"
    };
    setSpots([...spots, newSpot]);
    setNewSpotName('');
    setModalVisible(false);
    Alert.alert("¡Listo!", "Nuevo spot guardado en Bogotá.");
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 4.6300,
          longitude: -74.0700,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {spots.map(spot => (
          <Marker key={spot.id} coordinate={spot.coords} onPress={() => setSelectedSpot(spot)}>
            <Text style={{fontSize: 30}}>🌿</Text>
          </Marker>
        ))}
      </MapView>

      {/* Botón Flotante */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* MODAL DEL FORMULARIO */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalCentered}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nuevo Spot HighMaps 🌿</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del lugar (ej: Parque Virrey)"
              placeholderTextColor="#999"
              value={newSpotName}
              onChangeText={setNewSpotName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setModalVisible(false)}>
                <Text style={{color: 'white'}}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={saveNewSpot}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Tarjeta de Info (igual que antes) */}
      {selectedSpot && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{selectedSpot.title}</Text>
          <Text style={styles.cardText}>🛡️ Seguridad: {selectedSpot.security}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedSpot(null)}>
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
  fab: { position: 'absolute', right: 20, bottom: 40, backgroundColor: '#4CAF50', width: 65, height: 65, borderRadius: 33, justifyContent: 'center', alignItems: 'center', elevation: 10 },
  fabIcon: { color: 'white', fontSize: 35 },
  modalCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalView: { width: '85%', backgroundColor: '#1E1E1E', borderRadius: 20, padding: 25, borderWidth: 1, borderColor: '#4CAF50' },
  modalTitle: { color: '#4CAF50', fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#333', color: 'white', borderRadius: 10, padding: 15, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { padding: 12, borderRadius: 10, width: '45%', alignItems: 'center' },
  btnCancel: { backgroundColor: '#555' },
  btnSave: { backgroundColor: '#4CAF50' },
  card: { position: 'absolute', bottom: 120, left: 20, right: 20, backgroundColor: '#1E1E1E', padding: 20, borderRadius: 20 },
  cardTitle: { color: '#4CAF50', fontSize: 20, fontWeight: 'bold' },
  cardText: { color: 'white' },
  closeButton: { marginTop: 10, backgroundColor: '#333', padding: 10, borderRadius: 10, alignItems: 'center' }
});