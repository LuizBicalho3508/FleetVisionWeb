import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box, Typography, Grid } from '@mui/material';
import StatCard from '../components/dashboard/StatCard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import RouteIcon from '@mui/icons-material/Route';

const ClientDashboardPage = () => {
  const { liveDevices, summaryData } = useOutletContext();

  const online = liveDevices.filter(d => d.status === 'online').length;
  const moving = liveDevices.filter(d => d.speed > 0).length;
  const totalDistance = summaryData.distance ? (summaryData.distance / 1000).toFixed(1) : '0.0';
  const engineHours = summaryData.engineHours ? (summaryData.engineHours / 3600000).toFixed(1) : '0.0';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', mb: 2, borderLeft: '4px solid #7c4dff', pl: 2 }}>
          Minha Frota
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Veículos Online" value={`${online} / ${liveDevices.length}`} icon={<DirectionsCarIcon />} color="#00e5ff" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Em Movimento" value={moving} icon={<SpeedIcon />} color="#00e676" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Distância (Hoje)" value={totalDistance} unit="km" icon={<RouteIcon />} color="#7c4dff" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Horas Motor (Hoje)" value={engineHours} unit="h" icon={<AccessTimeFilledIcon />} color="#ff9100" />
          </Grid>
        </Grid>
      </Box>
      
      {/* Aqui podem entrar alertas recentes ou listagem rápida */}
    </Box>
  );
};

export default ClientDashboardPage;