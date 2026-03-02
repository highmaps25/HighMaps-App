import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function App() {
  const [spots, setSpots] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempCoords, setTempCoords] = useState(null); // <--- Coordenadas del punto tocado
  const [newSpotName, setNewSpotName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // FUNCIÓN PARA CUANDO DEJAS EL DEDO PRESIONADO
  const handleLongPress = (event) => {
    const coords = event.nativeEvent.coordinate;
    setTempCoords(coords); // Guardamos donde tocaste
    setModalVisible(true);  // Abrimos el formulario
  };

  const saveSpot = async () => {
    if (newSpotName.trim() === '' || !tempCoords) return;

    const newSpot = {
      id: Date.now(),
      title: newSpotName,
      latitude: tempCoords.latitude,
      longitude: tempCoords.longitude,
      user: "Comunidad_User_01" // <--- Inicio de la lógica de comunidad
    };

    const updated = [...spots, newSpot];
    setSpots(updated);
    await AsyncStorage.setItem('@high_spots', JSON.stringify(updated));
    
    setNewSpotName('');
    setTempCoords(null);
    setModalVisible(false);
    Alert.alert("¡Aporte a la Comunidad!", "Has marcado un nuevo spot en el mapa.");
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onLongPress={handleLongPress} // <--- ¡AQUÍ ESTÁ LA MAGIA!
        customMapStyle={isDarkMode ? darkMapStyle : []}
        showsUserLocation={true}
        initialRegion={{
          latitude: 4.6300, longitude: -74.0700,
          latitudeDelta: 0.05, longitudeDelta: 0.05,
        }}
      >
        {spots.map(spot => (
          <Marker key={spot.id} coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}>
            <View style={styles.markerContainer}>
              <Text style={{fontSize: 25}}>🌿</Text>
              <View style={styles.userTag}><Text style={styles.tagText}>Comunidad</Text></View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* MODAL DE REGISTRO REMOTO */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Marcar este lugar 📍</Text>
            <Text style={{color: '#888', marginBottom: 15, textAlign: 'center'}}>
              Estás creando un punto para la comunidad en estas coordenadas.
            </Text>
            <TextInput 
              style={styles.input} 
              placeholder="Nombre del Spot (Ej: Parque Nacional)" 
              placeholderTextColor="#666" 
              onChangeText={setNewSpotName} 
            />
            <View style={{flexDirection: 'row', gap: 10}}>
              <TouchableOpacity style={styles.btnSave} onPress={saveSpot}><Text style={{color:'white', fontWeight:'bold'}}>Publicar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}><Text style={{color:'white'}}>Cancelar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Botón de Modo Oscuro/Claro */}
      <TouchableOpacity 
        style={[styles.modeBtn, { backgroundColor: isDarkMode ? '#FFF' : '#1A1A1A' }]} 
        onPress={() => setIsDarkMode(!isDarkMode)}
      >
        <Text style={{ fontSize: 20 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos rápidos para la etiqueta de comunidad
const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject },
  markerContainer: { alignItems: 'center' },
  userTag: { backgroundColor: 'rgba(76, 175, 80, 0.8)', paddingHorizontal: 4, borderRadius: 4, marginTop: -5 },
  tagText: { color: 'white', fontSize: 8, fontWeight: 'bold' },
  modeBtn: { position: 'absolute', top: 50, right: 20, width: 45, height: 45, borderRadius: 23, justifyContent: 'center', alignItems: 'center', elevation: 10 },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { backgroundColor: '#1E1E1E', width: '85%', padding: 25, borderRadius: 20, borderTopWidth: 4, borderTopColor: '#4CAF50' },
  modalTitle: { color: '#4CAF50', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  input: { backgroundColor: '#333', color: 'white', borderRadius: 10, padding: 12, marginBottom: 20 },
  btnSave: { backgroundColor: '#4CAF50', flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' },
  btnCancel: { backgroundColor: '#333', flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' }
});


// --- 1. DEFINICIÓN DEL ESTILO (Asegúrate que esto esté ARRIBA de la función App) ---
const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#181818" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#1b5e20" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#8a8a8a" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  // ... (resto de tus estados como spots, modalVisible, etc.)

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        // MEJORA: Esta línea es la que activa el modo oscuro
        customMapStyle={isDarkMode ? darkMapStyle : []} 
        onLongPress={handleLongPress}
        showsUserLocation={true}
        initialRegion={{
          latitude: 4.6300, longitude: -74.0700,
          latitudeDelta: 0.05, longitudeDelta: 0.05,
        }}
      >
        {/* Aquí van tus marcadores 🌿 */}
      </MapView>

      {/* --- BOTÓN DE SWITCH (Mejorado visualmente) --- */}
      <TouchableOpacity 
        style={[styles.modeBtn, { backgroundColor: isDarkMode ? '#FFF' : '#1A1A1A' }]} 
        onPress={() => setIsDarkMode(!isDarkMode)}
      >
        <Text style={{ fontSize: 22 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>
      
      {/* ... resto de tu interfaz (Buscador, Modales, etc) */}
    </View>
  );
}