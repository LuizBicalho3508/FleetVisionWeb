// Local: src/components/RoutePolyline.jsx

import React from 'react';
import { Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

const RoutePolyline = ({ routeData }) => {
  const map = useMap();

  if (!routeData || routeData.length === 0) return null;

  // Converte dados para formato do Leaflet [lat, lng]
  const positions = routeData.map(pos => [pos.latitude, pos.longitude]);

  // Ajusta o zoom para mostrar toda a rota
  // (Opcional, já que o MapController também faz isso, mas mal não faz)
  // const bounds = L.latLngBounds(positions);
  // map.fitBounds(bounds);

  return (
    <Polyline 
      pathOptions={{ color: '#00e5ff', weight: 4, opacity: 0.8 }} 
      positions={positions} 
    />
  );
};

export default RoutePolyline;