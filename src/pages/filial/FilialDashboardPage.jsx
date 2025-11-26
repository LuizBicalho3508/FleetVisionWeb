// Local: src/pages/filial/FilialDashboardPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, CircularProgress, Paper } from '@mui/material';
import StatCard from '../../components/dashboard/StatCard';
import apiClient from '../../api/apiClient';
import dayjs from 'dayjs';

// Ícones
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventBusyIcon from '@mui/icons-material/EventBusy';

const FilialDashboardPage = () => {
  const [stats, setStats] = useState({ clientes: 0, veiculos: 0, online: 0, offline: 0 });
  const [contracts, setContracts] = useState({ active: 0, expired: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, devicesRes] = await Promise.all([
        apiClient.get('/users'),
        apiClient.get('/devices')
      ]);

      const veiculos = devicesRes.data;
      const clientes = usersRes.data.filter(u => !u.userLimit && !u.administrator); // Clientes da filial

      // Operacional
      setStats({
        clientes: clientes.length,
        veiculos: veiculos.length,
        online: veiculos.filter(d => d.status === 'online').length,
        offline: veiculos.filter(d => d.status === 'offline' || d.status === 'unknown').length,
      });

      // Contratos dos Clientes
      const now = dayjs();
      let active = 0, expired = 0;
      clientes.forEach(c => {
        const end = c.attributes?.contractEnd ? dayjs(c.attributes.contractEnd) : null;
        if (end) {
          if (end.isBefore(now, 'day')) expired++;
          else active++;
        } else {
            active++; // Sem data = Vigente por padrão
        }
      });
      setContracts({ active, expired });

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      
      {/* SEÇÃO OPERACIONAL */}
      <Box>
        <Typography variant="h6" sx={{ color: '#fff', mb: 2, borderLeft: '4px solid #00e5ff', pl: 2, fontWeight:'bold' }}>
          OPERAÇÃO DA FILIAL
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Meus Clientes" value={stats.clientes} icon={<PeopleAltIcon />} color="#7c4dff" /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Total Veículos" value={stats.veiculos} icon={<DirectionsCarIcon />} color="#00e5ff" /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Online Agora" value={stats.online} icon={<CheckCircleIcon />} color="#00e676" /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Offline" value={stats.offline} icon={<WarningIcon />} color="#ff1744" /></Grid>
        </Grid>
      </Box>

      {/* SEÇÃO CONTRATOS */}
      <Box>
        <Typography variant="h6" sx={{ color: '#fff', mb: 2, borderLeft: '4px solid #00e676', pl: 2, fontWeight:'bold' }}>
          STATUS CONTRATUAL (CLIENTES)
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Contratos Vigentes" value={contracts.active} icon={<AssignmentIcon />} color="#00e676" /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatCard title="Contratos Vencidos" value={contracts.expired} icon={<EventBusyIcon />} color="#ff1744" /></Grid>
          {/* Espaço para mais KPIs futuros */}
        </Grid>
      </Box>
    </Box>
  );
};

export default FilialDashboardPage;