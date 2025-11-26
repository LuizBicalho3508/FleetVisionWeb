import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip, Typography, Chip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import BlockIcon from '@mui/icons-material/Block';
import NotificationsIcon from '@mui/icons-material/Notifications';

const formatTime = (isoString) => isoString ? new Date(isoString).toLocaleString('pt-BR') : 'N/A';
const convertSpeed = (knots) => knots ? (knots * 1.852).toFixed(0) : '0';
const formatDistance = (meters) => meters ? (meters / 1000).toFixed(2) : '0.00';

const DeviceDataGrid = ({ devices, onDeviceSelect }) => {
  return (
    <TableContainer component={Paper} sx={{ maxHeight: '100%', background: 'rgba(30, 41, 59, 0.4)' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {/* Estilizando o cabeçalho para ser transparente mas legível */}
            {[
              'Placa', 'Motorista', 'Ignição', 'Bloqueio', 'Alertas', 
              'Data GPS', 'Localização', 'Velocidade', 'Voltagem', 
              'Odômetro', 'Horímetro', 'Ações'
            ].map((head) => (
              <TableCell 
                key={head}
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: 'rgba(15, 23, 42, 0.8)', // Fundo escuro semi-transparente para o header
                  color: '#00e5ff', // Cor de destaque do tema
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
                align={['Velocidade', 'Voltagem', 'Odômetro', 'Horímetro'].includes(head) ? 'right' : 'left'}
              >
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device) => (
            <TableRow 
              key={device.id} 
              hover 
              onClick={() => onDeviceSelect(device)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(0, 229, 255, 0.08) !important' } // Hover sutil
              }}
            >
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>{device.name}</TableCell>
              <TableCell sx={{ color: '#ccc' }}>{device.attributes?.driverName || '-'}</TableCell>
              
              <TableCell align="center">
                <Chip 
                  icon={<PowerSettingsNewIcon sx={{ fontSize: 16 }} />} 
                  label={device.attributes.ignition ? 'ON' : 'OFF'} 
                  color={device.attributes.ignition ? 'success' : 'default'} 
                  size="small" 
                  variant="outlined"
                />
              </TableCell>
              
              <TableCell align="center">
                <BlockIcon color={device.attributes.blocked ? 'error' : 'disabled'} fontSize="small" />
              </TableCell>
              
              <TableCell align="center"><NotificationsIcon color="action" fontSize="small" /></TableCell>
              
              <TableCell sx={{ color: '#ccc' }}>{formatTime(device.deviceTime)}</TableCell>
              
              <TableCell sx={{ maxWidth: 200 }}>
                <Typography variant="body2" noWrap sx={{ color: '#aaa' }}>
                  {device.address || 'Processando...'}
                </Typography>
              </TableCell>
              
              <TableCell align="right" sx={{ color: '#fff' }}>{convertSpeed(device.speed)} km/h</TableCell>
              <TableCell align="right" sx={{ color: '#ccc' }}>{device.attributes.power?.toFixed(1) || '-'} V</TableCell>
              <TableCell align="right" sx={{ color: '#ccc' }}>{formatDistance(device.attributes.totalDistance)} km</TableCell>
              <TableCell align="right" sx={{ color: '#ccc' }}>{(device.attributes.hours / 3600000).toFixed(1)} h</TableCell>
              
              <TableCell align="center">
                <IconButton size="small" sx={{ color: '#fff' }}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DeviceDataGrid;