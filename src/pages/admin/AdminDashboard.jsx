import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Button } from '@mui/material';
import StatCard from '../../components/dashboard/StatCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend 
} from 'recharts';
import { motion } from 'framer-motion'; // Para animações suaves
import DownloadIcon from '@mui/icons-material/Download';

// Dados Mockados para Exemplo (Substitua por chamadas de API reais)
const chartData = [
  { name: 'Jan', receita: 4000, custo: 2400 },
  { name: 'Fev', receita: 3000, custo: 1398 },
  { name: 'Mar', receita: 2000, custo: 9800 },
  { name: 'Abr', receita: 2780, custo: 3908 },
  { name: 'Mai', receita: 1890, custo: 4800 },
  { name: 'Jun', receita: 2390, custo: 3800 },
  { name: 'Jul', receita: 3490, custo: 4300 },
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento de dados
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  // Animação de entrada
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
      
      {/* Header com Ações */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Dashboard Executivo</Typography>
          <Typography variant="body2" color="text.secondary">Visão geral da operação e performance financeira</Typography>
        </Box>
        <Button variant="outlined" startIcon={<DownloadIcon />}>Exportar PDF</Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Faturamento Total', value: 'R$ 124.500', trend: '+12%', color: '#00e5ff' },
          { title: 'Veículos Ativos', value: '1,245', trend: '+5%', color: '#7c4dff' },
          { title: 'Novos Clientes', value: '48', trend: '+18%', color: '#00e676' },
          { title: 'Alertas Críticos', value: '3', trend: '-2%', color: '#ff1744' },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i} component={motion.div} variants={itemVariants}>
            <StatCard 
              title={stat.title} 
              value={stat.value} 
              icon={<Typography variant="caption" sx={{ color: stat.color, fontWeight:'bold' }}>{stat.trend}</Typography>} // Pode ser ícone real
              color={stat.color} 
            />
          </Grid>
        ))}
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Receita x Custo */}
        <Grid item xs={12} lg={8} component={motion.div} variants={itemVariants}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Performance Financeira (Semestral)</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCusto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c4dff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7c4dff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Legend verticalAlign="top" height={36}/>
                <Area type="monotone" dataKey="receita" stroke="#00e5ff" fillOpacity={1} fill="url(#colorRec)" name="Receita" />
                <Area type="monotone" dataKey="custo" stroke="#7c4dff" fillOpacity={1} fill="url(#colorCusto)" name="Custo" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Status da Frota */}
        <Grid item xs={12} lg={4} component={motion.div} variants={itemVariants}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Composição da Frota</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'Caminhões', qtd: 400 }, { name: 'Leves', qtd: 300 }, { name: 'Motos', qtd: 200 }]} layout="vertical">
                <XAxis type="number" stroke="#aaa" />
                <YAxis dataKey="name" type="category" stroke="#aaa" width={80} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b' }} />
                <Bar dataKey="qtd" fill="#00e676" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;