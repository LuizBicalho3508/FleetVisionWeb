// Local: src/components/DeviceMarker.jsx

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const convertSpeed = (knots) => (knots * 1.852).toFixed(0);
const formatTime = (iso) => new Date(iso).toLocaleString('pt-BR');

const DeviceMarker = ({ device }) => {
  if (!device.latitude || !device.longitude) return null;

  const getColor = () => {
    if (device.status === 'online') return device.speed > 0 ? '#00e676' : '#00e5ff';
    if (device.status === 'offline') return '#ff1744';
    return '#757575';
  };

  const color = getColor();
  const rotation = device.course || 0;

  // Ícone Customizado SVG com Rotação
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative; width: 32px; height: 32px;">
        <div style="
          transform: rotate(${rotation}deg); 
          width: 100%; 
          height: 100%; 
          filter: drop-shadow(0 0 4px ${color});
        ">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50,0 L 100,100 L 50,75 L 0,100 Z" fill="${color}" stroke="white" stroke-width="5"/>
          </svg>
        </div>
        <div style="
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0,0,0,0.8);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          white-space: nowrap;
          border: 1px solid ${color}44;
        ">${device.name}</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <Marker position={[device.latitude, device.longitude]} icon={customIcon}>
      <Popup className="glass-popup">
        <div style={{ textAlign: 'center' }}>
          <strong>{device.name}</strong><br/>
          {convertSpeed(device.speed)} km/h<br/>
          {formatTime(device.deviceTime)}
        </div>
      </Popup>
    </Marker>
  );
};

export default DeviceMarker;