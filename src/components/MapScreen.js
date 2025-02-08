// src/components/MapScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fonction utilitaire pour calculer la distance (formule de Haversine)
const getDistance = (loc1, loc2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000; // Rayon de la Terre en mètres
  const dLat = toRad(loc2.latitude - loc1.latitude);
  const dLon = toRad(loc2.longitude - loc1.longitude);
  const lat1 = toRad(loc1.latitude);
  const lat2 = toRad(loc2.latitude);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MapScreen = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [pois, setPois] = useState([]);

  // Obtenir la position de l'utilisateur et générer des POI
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const initialLocation = { latitude, longitude };
        setUserLocation(initialLocation);

        // Générer 5 POI aléatoires autour (entre 10 et 200 m)
        const generatedPOIs = [];
        for (let i = 0; i < 5; i++) {
          const distance = Math.random() * (200 - 10) + 10;
          const angle = Math.random() * 2 * Math.PI;
          const dLat = (distance * Math.cos(angle)) / 111000;
          const dLon = (distance * Math.sin(angle)) / (111000 * Math.cos(latitude * Math.PI / 180));
          generatedPOIs.push({
            id: i,
            latitude: latitude + dLat,
            longitude: longitude + dLon,
          });
        }
        setPois(generatedPOIs);
      }, (error) => {
        alert("Erreur de géolocalisation: " + error.message);
      });
    } else {
      alert("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }, []);

  // Simulation de déplacement vers le POI le plus proche
  useEffect(() => {
    if (!userLocation || pois.length === 0) return;
    let simulationRunning = true;
    const intervalId = setInterval(() => {
      let nearestPOI = null;
      let minDistance = Infinity;
      pois.forEach(poi => {
        const dist = getDistance(userLocation, poi);
        if (dist < minDistance) {
          minDistance = dist;
          nearestPOI = poi;
        }
      });
      if (!nearestPOI) return;
      // Si la distance est inférieure à 5 m, arrêter la simulation et naviguer vers la page AR
      if (minDistance < 5) {
        clearInterval(intervalId);
        simulationRunning = false;
        navigate("/ar");
        return;
      }
      // Simuler le déplacement vers le POI le plus proche
      const speed = 11.11; // m/s (environ 40 km/h)
      const fraction = speed / minDistance;
      userLocation.latitude += (nearestPOI.latitude - userLocation.latitude) * fraction;
      userLocation.longitude += (nearestPOI.longitude - userLocation.longitude) * fraction;
      setUserLocation({ ...userLocation });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [userLocation, pois, navigate]);

  // Définition des icônes pour les marqueurs
  const violetIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
  });
  const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
  });

  if (!userLocation) {
    return <div>Chargement de la position...</div>;
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={15} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={violetIcon}>
          <Popup>Vous êtes ici</Popup>
        </Marker>
        {pois.map((poi) => (
          <Marker key={poi.id} position={[poi.latitude, poi.longitude]} icon={redIcon}>
            <Popup>POI {poi.id}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapScreen;
