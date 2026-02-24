import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HighMaps 🌿</Text>
        <Text style={styles.subtitle}>Tu guía segura en Bogotá</Text>
      </View>
      
      <View style={styles.body}>
        <Text style={styles.status}>Estamos configurando el mapa...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro como el techno
  },
  header: {
    padding: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50', // Verde cannabis
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    color: '#888',
    fontStyle: 'italic',
  },
});