import React, { useEffect, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography, Chip } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// Função auxiliar para rotação e cor
const createRotatedIcon = (color, rotation, name) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-container" style="transition: all 0.5s ease-out;">
        <div style="
          transform: rotate(${rotation}deg); 
          width: 32px; height: 32px;
          filter: drop-shadow(0 0 4px ${color});
          transition: transform 0.5s linear;
        ">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50,0 L 100,100 L 50,75 L 0,100 Z" fill="${color}" stroke="white" stroke-width="5"/>
          </svg>
        </div>
        <div class="marker-label" style="
          background-color: rgba(0,0,0,0.8); color: white;
          padding: 2px 6px; border-radius: 4px; font-size: 10px;
          white-space: nowrap; border: 1px solid ${color}44;
          margin-top: 4px; text-align: center;
        ">${name}</div>
      </div>
    `,
    iconSize: [32, 50],
    iconAnchor: [16, 16],
  });
};

const DeviceMarker = ({ device }) => {
  const markerRef = useRef(null);

  // Cores baseadas no status
  const getColor = () => {
    if (device.status === 'online') return device.speed > 0 ? '#00e676' : '#00e5ff'; // Verde (movendo) ou Azul (parado)
    if (device.status === 'offline') return '#ff1744'; // Vermelho
    return '#757575'; // Cinza (desconhecido)
  };

  // Se o dispositivo não tem posição, não renderiza
  if (!device.latitude || !device.longitude) return null;

  return (
    <Marker 
      ref={markerRef}
      position={[device.latitude, device.longitude]} 
      icon={createRotatedIcon(getColor(), device.course || 0, device.name)}
    >
      <Popup>
        <Box sx={{ textAlign: 'center', p: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{device.name}</Typography>
          <Typography variant="caption" display="block" sx={{ color: '#666', mb: 1 }}>
            {new Date(device.lastUpdate || device.deviceTime).toLocaleString()}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 1 }}>
            <Chip 
              label={`${(device.speed * 1.852).toFixed(0)} km/h`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              label={device.status === 'online' ? 'Online' : 'Offline'} 
              size="small" 
              color={device.status === 'online' ? 'success' : 'error'} 
            />
          </Box>
          
          <Typography variant="caption" sx={{ display: 'block', maxWidth: 200 }} noWrap>
            {device.address || 'Endereço não processado'}
          </Typography>
        </Box>
      </Popup>
    </Marker>
  );
};

export default DeviceMarker;