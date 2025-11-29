import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box, Typography, Chip, Avatar } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RichTable from '../components/common/RichTable';

const ClientVehiclesPage = () => {
  const { liveDevices } = useOutletContext();

  const columns = [
    { id: 'name', label: 'Veículo', render: (row) => (
      <Box sx={{display:'flex', alignItems:'center', gap: 2}}>
        <Avatar sx={{bgcolor:'secondary.main', width:30, height:30}}><DirectionsCarIcon fontSize="small"/></Avatar>
        <Box>
          <Typography variant="body2" fontWeight="bold">{row.name}</Typography>
          <Typography variant="caption" color="text.secondary">{row.model || 'Padrão'}</Typography>
        </Box>
      </Box>
    )},
    { id: 'lastUpdate', label: 'Última Atualização', render: (row) => new Date(row.lastUpdate || row.deviceTime).toLocaleString() },
    { id: 'speed', label: 'Velocidade', render: (row) => `${(row.speed * 1.852).toFixed(0)} km/h` },
    { id: 'status', label: 'Status', render: (row) => (
      <Chip label={row.status === 'online' ? 'Online' : 'Offline'} color={row.status === 'online' ? 'success' : 'default'} size="small" />
    )}
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Meus Veículos</Typography>
      <RichTable 
        title="Frota Ativa"
        data={liveDevices}
        columns={columns}
        selectable={false} // Cliente geralmente apenas visualiza
      />
    </Box>
  );
};

export default ClientVehiclesPage;