// Local: src/components/MapComponent.jsx

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import DeviceMarker from './DeviceMarker';
import RoutePolyline from './RoutePolyline';

// Fix ícones Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

// Controlador de Zoom Inteligente
const MapController = ({ selectedPosition, routeData, devices }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // 1. Foco em Veículo Único
    if (selectedPosition && selectedPosition.latitude && selectedPosition.longitude) {
      map.flyTo([selectedPosition.latitude, selectedPosition.longitude], 16, { animate: true, duration: 1.5 });
    } 
    // 2. Foco em Rota
    else if (Array.isArray(routeData) && routeData.length > 0) {
      const points = routeData.map(pos => [pos.latitude, pos.longitude]);
      const bounds = L.latLngBounds(points);
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [50, 50] });
    }
    // 3. Foco na Frota (Auto-Fit)
    else if (Array.isArray(devices) && devices.length > 0) {
      const validDevices = devices.filter(d => d.latitude && d.longitude && d.latitude !== 0);
      if (validDevices.length > 0) {
        const points = validDevices.map(d => [d.latitude, d.longitude]);
        const bounds = L.latLngBounds(points);
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });
      } else {
        // Se não tiver veículos válidos, vai para o padrão Brasil
        map.setView([-14.2350, -51.9253], 4);
      }
    }
  }, [map, selectedPosition, routeData, devices]);

  return null;
};

const MapComponent = ({ devices = [], selectedPosition, routeData = [] }) => {
  const defaultPosition = [-14.2350, -51.9253];
  
  // Garante que devices seja sempre array
  const safeDevices = Array.isArray(devices) ? devices : [];

  return (
    <MapContainer 
      center={defaultPosition} 
      zoom={4} 
      style={{ height: '100%', width: '100%', borderRadius: '4px', background: '#1a202c' }}
      zoomControl={false}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Dark (Noturno)">
          <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satélite">
          <TileLayer attribution='&copy; Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Claro">
          <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer attribution='&copy; OSM' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
      </LayersControl>

      <MapController selectedPosition={selectedPosition} routeData={routeData} devices={safeDevices} />

      {safeDevices.map(device => (
        <DeviceMarker key={device.id} device={device} />
      ))}

      <RoutePolyline routeData={routeData} />
    </MapContainer>
  );
};

export default MapComponent;