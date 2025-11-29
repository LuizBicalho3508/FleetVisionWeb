import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box, Typography, Grid, Paper, useTheme } from '@mui/material';
import StatCard from '../components/dashboard/StatCard';
import { motion } from 'framer-motion';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import RouteIcon from '@mui/icons-material/Route';

const ClientDashboardPage = () => {
  const { liveDevices, summaryData } = useOutletContext();
  const theme = useTheme();

  const online = liveDevices.filter(d => d.status === 'online').length;
  const moving = liveDevices.filter(d => d.speed > 0).length;
  const totalDistance = summaryData.distance ? (summaryData.distance / 1000).toFixed(1) : '0.0';
  const engineHours = summaryData.engineHours ? (summaryData.engineHours / 3600000).toFixed(1) : '0.0';

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Minha Frota</Typography>
        <Typography variant="body2" color="text.secondary">Resumo operacional de hoje</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
          <StatCard 
            title="Veículos Online" 
            value={`${online} / ${liveDevices.length}`} 
            icon={<DirectionsCarIcon />} 
            color={theme.palette.primary.main} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
          <StatCard 
            title="Em Movimento" 
            value={moving} 
            icon={<SpeedIcon />} 
            color="#00e676" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
          <StatCard 
            title="Distância (Hoje)" 
            value={totalDistance} 
            unit="km" 
            icon={<RouteIcon />} 
            color="#7c4dff" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
          <StatCard 
            title="Horas Motor" 
            value={engineHours} 
            unit="h" 
            icon={<AccessTimeFilledIcon />} 
            color="#ff9100" 
          />
        </Grid>
      </Grid>
      
      {/* Exemplo de Lista Recente Rápida */}
      <Box sx={{ mt: 4 }} component={motion.div} variants={itemVariants}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Status Recente</Typography>
        <Grid container spacing={2}>
            {liveDevices.slice(0, 4).map(device => (
                <Grid item xs={12} md={3} key={device.id}>
                    <Paper sx={{ p: 2, borderRadius: 2, borderLeft: `4px solid ${device.status === 'online' ? '#00e676' : '#ff1744'}` }}>
                        <Typography variant="subtitle1" fontWeight="bold">{device.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{device.status === 'online' ? 'Conectado' : 'Sem sinal'}</Typography>
                    </Paper>
                </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ClientDashboardPage;