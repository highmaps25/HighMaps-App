import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const { width } = Dimensions.get('window');

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#1b5e20" }] },
  { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];

export default function App() {
  const mapRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSpotName, setNewSpotName] = useState('');
  const [securityLevel, setSecurityLevel] = useState('Alta');

  useEffect(() => { loadSpots(); }, []);

  const loadSpots = async () => {
    try {
      const saved = await AsyncStorage.getItem('@high_spots');
      if (saved) setSpots(JSON.parse(saved));
    } catch (e) { console.log(e); }
  };

  const saveSpot = async () => {
    if (newSpotName.trim() === '') return;
    let loc = await Location.getCurrentPositionAsync({});
    const newSpot = {
      id: Date.now(),
      title: newSpotName,
      security: securityLevel,
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    const updated = [...spots, newSpot];
    setSpots(updated);
    await AsyncStorage.setItem('@high_spots', JSON.stringify(updated));
    setNewSpotName('');
    setModalVisible(false);
    Alert.alert("Éxito", "Spot guardado 🌿");
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={isDarkMode ? darkMapStyle : []}
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
            <Text style={{fontSize: 25}}>🌿</Text>
          </Marker>
        ))}
      </MapView>

      {/* BUSCADOR */}
      <View style={styles.searchBox}>
        <GooglePlacesAutocomplete
          placeholder='Buscar en Bogotá... 🔍'
          onPress={(data) => console.log(data)}
          query={{ key: 'TU_API_KEY', language: 'es' }}
          styles={{
            textInput: [styles.searchInput, { backgroundColor: isDarkMode ? '#1A1A1A' : '#FFF', color: isDarkMode ? '#FFF' : '#000' }],
          }}
        />
      </View>

      {/* BOTÓN MODO LUZ/OSCURIDAD */}
      <TouchableOpacity 
        style={[styles.modeBtn, { backgroundColor: isDarkMode ? '#FFF' : '#1A1A1A' }]} 
        onPress={() => setIsDarkMode(!isDarkMode)}
      >
        <Text style={{ fontSize: 22 }}>{isDarkMode ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>

      {/* INFO CARD DE SPOT SELECCIONADO */}
      {selectedSpot && (
        <View style={[styles.infoCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }]}>
          <Text style={styles.cardTitle}>{selectedSpot.title}</Text>
          <Text style={{color: isDarkMode ? '#AAA' : '#666'}}>🛡️ Seguridad: <Text style={{color: '#4CAF50', fontWeight: 'bold'}}>{selectedSpot.security}</Text></Text>
          <TouchableOpacity style={styles.closeCard} onPress={() => setSelectedSpot(null)}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>CERRAR</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FORMULARIO NUEVO SPOT */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.centeredView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Spot 🌿</Text>
            <TextInput style={styles.input} placeholder="Nombre del sitio..." placeholderTextColor="#666" onChangeText={setNewSpotName} />
            <Text style={{color: '#FFF', marginBottom: 10}}>Seguridad:</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                {['Alta', 'Media', 'Baja'].map(lvl => (
                    <TouchableOpacity key={lvl} onPress={() => setSecurityLevel(lvl)} style={[styles.lvlBtn, securityLevel === lvl && {borderColor: '#4CAF50', borderWidth: 2}]}>
                        <Text style={{color: 'white'}}>{lvl}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{flexDirection: 'row', gap: 10, marginTop: 20}}>
              <TouchableOpacity style={styles.btnSave} onPress={saveSpot}><Text style={styles.btnText}>Guardar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}><Text style={styles.btnText}>Cerrar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject },
  searchBox: { position: 'absolute', top: 50, width: width - 90, left: 15, zIndex: 5 },
  searchInput: { borderRadius: 15, paddingHorizontal: 15, height: 45, borderWidth: 1, borderColor: '#4CAF50' },
  modeBtn: { position: 'absolute', top: 50, right: 15, width: 45, height: 45, borderRadius: 23, justifyContent: 'center', alignItems: 'center', elevation: 10, zIndex: 6 },
  infoCard: { position: 'absolute', bottom: 120, left: 20, right: 20, padding: 20, borderRadius: 20, elevation: 20, borderLeftWidth: 6, borderLeftColor: '#4CAF50' },
  cardTitle: { color: '#4CAF50', fontSize: 22, fontWeight: 'bold' },
  closeCard: { marginTop: 15, backgroundColor: '#333', padding: 10, borderRadius: 10, alignItems: 'center' },
  fab: { position: 'absolute', bottom: 40, right: 30, backgroundColor: '#1b5e20', width: 65, height: 65, borderRadius: 33, justifyContent: 'center', alignItems: 'center', elevation: 10, borderWidth: 2, borderColor: '#4CAF50' },
  fabIcon: { color: 'white', fontSize: 40, marginTop: -5 },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { backgroundColor: '#1E1E1E', width: '85%', padding: 25, borderRadius: 20 },
  modalTitle: { color: '#4CAF50', fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: '#333', color: 'white', borderRadius: 10, padding: 12, marginBottom: 20 },
  lvlBtn: { backgroundColor: '#444', padding: 8, borderRadius: 8, width: '30%', alignItems: 'center' },
  btnSave: { backgroundColor: '#4CAF50', flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' },
  btnCancel: { backgroundColor: '#FF5252', flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' }
});