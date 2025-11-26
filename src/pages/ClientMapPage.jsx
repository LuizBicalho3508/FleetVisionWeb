import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box, Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import MapComponent from '../components/MapComponent';
import CircleIcon from '@mui/icons-material/Circle';

const ClientMapPage = () => {
  const { liveDevices } = useOutletContext();
  const [selectedPosition, setSelectedPosition] = useState(null);

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 120px)', gap: 2 }}>
      {/* Lista Lateral Glass */}
      <Paper sx={{ 
        width: 320, 
        display: { xs: 'none', md: 'flex' }, 
        flexDirection: 'column',
        background: 'rgba(30, 41, 59, 0.6)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h6" sx={{ color: '#fff' }}>Veículos ({liveDevices.length})</Typography>
        </Box>
        <List sx={{ overflow: 'auto', flexGrow: 1 }}>
          {liveDevices.map(device => (
            <ListItem 
              key={device.id} 
              button 
              onClick={() => setSelectedPosition({ latitude: device.latitude, longitude: device.longitude })}
              sx={{ 
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                '&:hover': { background: 'rgba(0, 229, 255, 0.1)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CircleIcon sx={{ 
                  fontSize: 12, 
                  color: device.status === 'online' ? '#00e676' : '#ff1744',
                  filter: `drop-shadow(0 0 4px ${device.status === 'online' ? '#00e676' : '#ff1744'})`
                }} />
              </ListItemIcon>
              <ListItemText 
                primary={device.name} 
                secondary={device.status === 'online' ? `${(device.speed * 1.852).toFixed(0)} km/h` : 'Sem sinal'}
                primaryTypographyProps={{ color: '#fff', fontWeight: 'medium' }}
                secondaryTypographyProps={{ color: 'rgba(255,255,255,0.6)' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Mapa */}
      <Paper sx={{ flexGrow: 1, borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <MapComponent devices={liveDevices} selectedPosition={selectedPosition} />
      </Paper>
    </Box>
  );
};

export default ClientMapPage;