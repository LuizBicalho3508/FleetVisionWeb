import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Grid, Paper, Tabs, Tab, Button, Avatar, Chip, IconButton, Divider 
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MapIcon from '@mui/icons-material/Map';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';

// Componentes
import MapComponent from '../components/MapComponent';
import MaintenanceList from '../components/vehicles/MaintenanceList';
import StatCard from '../components/dashboard/StatCard';

const ClientVehicleDetailsPage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  // Busca dados do veículo específico
  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: async () => {
      const res = await apiClient.get('/devices', { params: { id: vehicleId } });
      return res.data[0];
    }
  });

  if (isLoading || !vehicle) return <Typography sx={{p:4, color:'#fff'}}>Carregando prontuário...</Typography>;

  const isOnline = vehicle.status === 'online';

  return (
    <Box sx={{ pb: 4 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
            {vehicle.name}
            <Chip 
              label={isOnline ? 'Online' : 'Offline'} 
              color={isOnline ? 'success' : 'error'} 
              variant="outlined" 
              size="small"
            />
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            {vehicle.model || 'Modelo não informado'} • IMEI: {vehicle.uniqueId}
          </Typography>
        </Box>
      </Box>

      {/* KPI CARDS RÁPIDOS */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, bgcolor: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}><DirectionsCarIcon /></Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary">ODÔMETRO</Typography>
              <Typography variant="h6" color="#fff">{(vehicle.attributes.totalDistance / 1000).toFixed(0)} km</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, bgcolor: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}><PersonIcon /></Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary">MOTORISTA</Typography>
              <Typography variant="h6" color="#fff">{vehicle.attributes.driverName || 'Não atribuído'}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, bgcolor: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: isOnline ? '#00e676' : '#ff1744' }}><MapIcon /></Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary">VELOCIDADE ATUAL</Typography>
              <Typography variant="h6" color="#fff">{(vehicle.speed * 1.852).toFixed(0)} km/h</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* CONTEÚDO PRINCIPAL (TABS) */}
      <Paper sx={{ bgcolor: 'rgba(30,41,59,0.4)', backdropFilter: 'blur(10px)', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
          <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} textColor="primary" indicatorColor="primary">
            <Tab icon={<MapIcon />} label="Localização Ao Vivo" iconPosition="start" />
            <Tab icon={<BuildIcon />} label="Manutenções & Custos" iconPosition="start" />
            <Tab icon={<AssessmentIcon />} label="Dados Técnicos" iconPosition="start" />
          </Tabs>
        </Box>

        {/* ABA 0: MAPA */}
        {tabIndex === 0 && (
          <Box sx={{ height: 500, p: 0 }}>
            <MapComponent devices={[vehicle]} selectedPosition={{ latitude: vehicle.latitude, longitude: vehicle.longitude }} />
          </Box>
        )}

        {/* ABA 1: MANUTENÇÃO */}
        {tabIndex === 1 && (
          <Box sx={{ p: 3 }}>
            <MaintenanceList deviceId={vehicle.id} />
          </Box>
        )}

        {/* ABA 2: DADOS TÉCNICOS (JSON DUMP BONITO) */}
        {tabIndex === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {Object.entries(vehicle.attributes).map(([key, value]) => (
                <Grid item xs={6} sm={4} key={key}>
                  <Box sx={{ p: 1.5, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ color: 'primary.main', textTransform: 'uppercase' }}>{key}</Typography>
                    <Typography variant="body2" sx={{ color: '#fff', wordBreak: 'break-all' }}>{String(value)}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ClientVehicleDetailsPage;