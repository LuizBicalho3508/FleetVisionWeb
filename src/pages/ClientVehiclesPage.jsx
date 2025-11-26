import React from 'react';
import { useOutletContext, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import DeviceDataGrid from '../components/DeviceDataGrid'; // Reutiliza a tabela profissional
import EditIcon from '@mui/icons-material/Edit';

const ClientVehiclesPage = () => {
  const { liveDevices } = useOutletContext();

  return (
    <Box>
      <Typography variant="h4" sx={{ color: '#fff', mb: 3, fontWeight: 'bold' }}>Meus Veículos</Typography>
      <Box sx={{ height: 600 }}>
        <DeviceDataGrid 
          devices={liveDevices} 
          onDeviceSelect={(device) => {
             // Ação ao clicar na linha (opcional)
          }}
        />
      </Box>
    </Box>
  );
};

export default ClientVehiclesPage;