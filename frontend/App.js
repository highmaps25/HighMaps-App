import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Dimensions, Alert, ActivityIndicator } from 'react-native'; // <--- Agregamos ActivityIndicator
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const { width, height } = Dimensions.get('window'); // <--- Agregamos height

// 1. ESTILO OSCURO (Mismo de antes)
const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#1b5e20" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

export default function App() {
  const mapRef = useRef(null);
  
  // --- NUEVO ESTADO: CONTROL DE CARGA ---
  const [isLoading, setIsLoading] = useState(true); // <--- Empieza cargando
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempCoords, setTempCoords] = useState(null);
  const [newSpotName, setNewSpotName] = useState('');
  const [securityLevel, setSecurityLevel] = useState('Alta');

  // MODIFICADO: Lógica de Carga Inicial
  useEffect(() => {
    (async () => {
      // 1. Cargar Spots locales (lo que ya teníamos)
      await loadSpots();
      
      // 2. Pedir GPS y esperar posición (lo que ya teníamos)
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permiso denegado", "Necesitamos GPS para funcionar.");
      } else {
        await Location.getCurrentPositionAsync({}); // Esperamos a que el GPS responda
      }

      // 3. FINALIZAR CARGA: Ocultar el logo y mostrar el mapa
      // Añadimos un pequeño retraso (retraso intencional) de 1.5s para que el logo se aprecie
      setTimeout(() => {
        setIsLoading(false); 
      }, 1500);

    })();
  }, []);

  const loadSpots = async () => {
    try {
      const saved = await AsyncStorage.getItem('@high_spots');
      if (saved) setSpots(JSON.parse(saved));
    } catch (e) { console.log(e); }
  };

  const handleLongPress = (event) => {
    setTempCoords(event.nativeEvent.coordinate);
    setModalVisible(true);
  };

  const saveSpot = async () => {
    if (newSpotName.trim() === '') return;
    let loc = await Location.getCurrentPositionAsync({});
    const newSpot = {
      id: Date.now(),
      title: newSpotName,
      security: securityLevel,
      latitude: tempCoords ? tempCoords.latitude : loc.coords.latitude,
      longitude: tempCoords ? tempCoords.longitude : loc.coords.longitude,
    };
    const updated = [...spots, newSpot];
    setSpots(updated);
    await AsyncStorage.setItem('@high_spots', JSON.stringify(updated));
    setNewSpotName('');
    setTempCoords(null);
    setModalVisible(false);
    Alert.alert("Éxito", "Spot guardado 🌿");
  };

  // --- NUEVA PANTALLA: LOGO LOADING (Renderizado Condicional) ---
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* LOGO HIGHMAPS (Diseño con Estilos) */}
        <View style={styles.logoFrame}>
          <Text style={styles.logoTextHigh}>High</Text>
          <Text style={styles.logoTextMaps}>Maps</Text>
          <Text style={styles.logoLeaf}>🌿</Text>
        </View>
        
        {/* Indicador de carga sutil */}
        <ActivityIndicator size="large" color="#4CAF50" style={{marginTop: 40}} />
        <Text style={styles.loadingSubText}>Conectando con Bogotá...</Text>
      </View>
    );
  }

  // --- RENDERIZADO DEL MAPA (Lo que ya funcionaba, sin tocar nada) ---
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={isDarkMode ? darkMapStyle : []}
        onLongPress={handleLongPress}
        showsUserLocation={true}
        initialRegion={{
          latitude: 4.6300, longitude: -74.0700,
          latitudeDelta: 0.05, longitudeDelta: 0.05,
        }}
      >
        {spots.map(spot => (
          <Marker 
            key={spot.id} 
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            onPress={() => setSelectedSpot(spot)}
          >
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 25}}>🌿</Text>
              <View style={styles.tag}><Text style={styles.tagText}>Comunidad</Text></View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* BUSCADOR */}
      <View style={styles.searchBox}>
        <GooglePlacesAutocomplete
          placeholder='Buscar en Bogotá...'
          onPress={() => {}}
          query={{ key: 'TU_API_KEY', language: 'es' }}
          styles={{ textInput: [styles.inputSearch, {backgroundColor: isDarkMode ? '#1A1A1A' : '#FFF', color: isDarkMode ? '#FFF' : '#000'}] }}
        />
      </View>

      {/* BOTÓN DARK MODE */}
      <TouchableOpacity 
        style={[styles.modeBtn, { backgroundColor: isDarkMode ? '#FFF' : '#1A1A1A' }]} 
        onPress={() => setIsDarkMode(!isDarkMode)}
      >
        <Text style={{ fontSize: 22 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>

      {/* INFO CARD */}
      {selectedSpot && (
        <View style={[styles.infoCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }]}>
          <Text style={styles.cardTitle}>{selectedSpot.title}</Text>
          <Text style={{color: isDarkMode ? '#AAA' : '#666'}}>🛡️ Seguridad: {selectedSpot.security}</Text>
          <TouchableOpacity style={styles.closeCard} onPress={() => setSelectedSpot(null)}>
            <Text style={{color: 'white'}}>CERRAR</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODAL NUEVO SPOT */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.centeredView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Spot 🌿</Text>
            <TextInput style={styles.input} placeholder="Nombre del sitio..." placeholderTextColor="#666" onChangeText={setNewSpotName} />
            <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
              <TouchableOpacity style={styles.btnSave} onPress={saveSpot}><Text style={styles.btnText}>Guardar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}><Text style={styles.btnText}>Cerrar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject },
  
  // --- NUEVOS ESTILOS: LOADING & LOGO ---
  loadingContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  logoFrame: { alignItems: 'center', position: 'relative' },
  logoTextHigh: { color: '#FFF', fontSize: 60, fontWeight: 'bold', letterSpacing: -2 },
  logoTextMaps: { color: '#4CAF50', fontSize: 45, fontWeight: '300', marginTop: -15, textShadowColor: 'rgba(76, 175, 80, 0.5)', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 15 },
  logoLeaf: { fontSize: 40, marginTop: 10 },
  loadingSubText: { color: '#666', marginTop: 15, fontSize: 14, fontWeight: '300' },
  
  // --- ESTILOS ORIGINALES (Sin tocar) ---
  searchBox: { position: 'absolute', top: 50, width: width - 80, left: 10, zIndex: 10 },
  inputSearch: { borderRadius: 10, paddingHorizontal: 15, height: 40, borderWidth: 1, borderColor: '#4CAF50' },
  modeBtn: { position: 'absolute', top: 50, right: 10, width: 45, height: 45, borderRadius: 23, justifyContent: 'center', alignItems: 'center', elevation: 10, zIndex: 11 },
  tag: { backgroundColor: '#4CAF50', paddingHorizontal: 4, borderRadius: 4 },
  tagText: { color: 'white', fontSize: 8, fontWeight: 'bold' },
  infoCard: { position: 'absolute', bottom: 50, left: 20, right: 20, padding: 20, borderRadius: 20, elevation: 20 },
  cardTitle: { color: '#4CAF50', fontSize: 20, fontWeight: 'bold' },
  closeCard: { marginTop: 10, backgroundColor: '#333', padding: 8, borderRadius: 10, alignItems: 'center' },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { backgroundColor: '#1E1E1E', width: '80%', padding: 25, borderRadius: 20 },
  modalTitle: { color: '#4CAF50', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: '#333', color: 'white', borderRadius: 10, padding: 10, marginBottom: 10 },
  btnSave: { backgroundColor: '#4CAF50', flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  btnCancel: { backgroundColor: '#FF5252', flex: 1, padding: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' }
});