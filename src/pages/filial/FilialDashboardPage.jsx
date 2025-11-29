import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, CircularProgress, Paper, useTheme } from '@mui/material';
import StatCard from '../../components/dashboard/StatCard';
import apiClient from '../../api/apiClient';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Ícones
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const FilialDashboardPage = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({ clientes: 0, veiculos: 0, online: 0, offline: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, devicesRes] = await Promise.all([
        apiClient.get('/users'),
        apiClient.get('/devices')
      ]);

      const veiculos = devicesRes.data;
      const clientes = usersRes.data.filter(u => !u.userLimit && !u.administrator);

      setStats({
        clientes: clientes.length,
        veiculos: veiculos.length,
        online: veiculos.filter(d => d.status === 'online').length,
        offline: veiculos.filter(d => d.status === 'offline' || d.status === 'unknown').length,
      });

      // Mock para gráfico (em produção, agrupe dados reais)
      setChartData([
        { name: 'On', value: veiculos.filter(d => d.status === 'online').length },
        { name: 'Off', value: veiculos.filter(d => d.status !== 'online').length }
      ]);

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Visão Geral da Filial</Typography>
        <Typography variant="body2" color="text.secondary">Acompanhamento em tempo real da operação</Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
          <StatCard title="Meus Clientes" value={stats.clientes} icon={<PeopleAltIcon />} color={theme.palette.secondary.main} />
        </Grid>
        <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
          <StatCard title="Total Veículos" value={stats.veiculos} icon={<DirectionsCarIcon />} color={theme.palette.primary.main} />
        </Grid>
        <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
          <StatCard title="Online Agora" value={stats.online} icon={<CheckCircleIcon />} color="#00e676" />
        </Grid>
        <Grid item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
          <StatCard title="Offline" value={stats.offline} icon={<WarningIcon />} color="#ff1744" />
        </Grid>
      </Grid>

      {/* Gráfico */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} component={motion.div} variants={itemVariants}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Conectividade da Frota</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.1} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={50} tick={{ fill: theme.palette.text.secondary }} />
                <Tooltip 
                  cursor={{fill: 'transparent'}} 
                  contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: 8, border: 'none' }} 
                />
                <Bar dataKey="value" fill={theme.palette.primary.main} radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilialDashboardPage;