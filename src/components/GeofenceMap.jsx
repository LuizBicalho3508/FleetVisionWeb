// Local: src/components/GeofenceMap.jsx

import React from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Hack para corrigir ícones do Leaflet Draw se sumirem
import L from 'leaflet';
window.type = ''; // Fix estranho necessário em algumas versões

const GeofenceMap = ({ onShapeComplete }) => {
  const defaultPosition = [-14.2350, -51.9253];

  const handleCreated = (e) => {
    const { layerType, layer } = e;
    let wkt = '';

    if (layerType === 'polygon' || layerType === 'rectangle') {
      const latLngs = layer.getLatLngs()[0];
      const coords = latLngs.map(ll => `${ll.lat} ${ll.lng}`);
      // Fecha o polígono
      coords.push(`${latLngs[0].lat} ${latLngs[0].lng}`);
      // Nota: O Traccar espera LAT LON na ordem, mas o WKT padrão é LON LAT. 
      // Se der erro de posição, inverta para `${ll.lng} ${ll.lat}`.
      // O Traccar geralmente aceita "lat lon" se configurado, mas o padrão WKT é "lon lat".
      // Vamos usar o padrão visual: lat lng
      wkt = `POLYGON ((${coords.join(', ')}))`;
    } else if (layerType === 'circle') {
      const ll = layer.getLatLng();
      const radius = layer.getRadius();
      wkt = `CIRCLE (${ll.lat} ${ll.lng}, ${radius})`;
    }

    onShapeComplete(wkt);
  };

  return (
    <MapContainer center={defaultPosition} zoom={4} style={{ height: '100%', width: '100%', background:'#242f3e' }}>
      <TileLayer
        attribution='&copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          draw={{
            rectangle: true,
            polygon: true,
            circle: true,
            polyline: false,
            marker: false,
            circlemarker: false
          }}
          edit={{ edit: false, remove: true }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default GeofenceMap;