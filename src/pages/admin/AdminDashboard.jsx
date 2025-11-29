import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, CircularProgress, Button, IconButton, Menu, MenuItem, useTheme 
} from '@mui/material';
import StatCard from '../../components/dashboard/StatCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { motion } from 'framer-motion'; 
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Mock de dados para o exemplo (em produção viria da API)
const performanceData = [
  { name: 'Jan', receita: 4000, custo: 2400 },
  { name: 'Fev', receita: 3000, custo: 1398 },
  { name: 'Mar', receita: 2000, custo: 9800 },
  { name: 'Abr', receita: 2780, custo: 3908 },
  { name: 'Mai', receita: 1890, custo: 4800 },
  { name: 'Jun', receita: 2390, custo: 3800 },
  { name: 'Jul', receita: 3490, custo: 4300 },
];

const pieData = [
  { name: 'Em Manutenção', value: 4, color: '#ff1744' },
  { name: 'Em Rota', value: 12, color: '#00e676' },
  { name: 'Parados', value: 8, color: '#7c4dff' },
];

const AdminDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('Últimos 30 dias');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Simula carregamento
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  // Variantes de Animação
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible" sx={{ pb: 4 }}>
      
      {/* Header com Ações */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            Dashboard Executivo
          </Typography>
          <Typography variant="body2" color="text.secondary">Visão geral da operação e performance financeira</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<CalendarTodayIcon />} 
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ borderColor: 'rgba(255,255,255,0.2)' }}
          >
            {period}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => { setPeriod('Hoje'); setAnchorEl(null); }}>Hoje</MenuItem>
            <MenuItem onClick={() => { setPeriod('Últimos 7 dias'); setAnchorEl(null); }}>Últimos 7 dias</MenuItem>
            <MenuItem onClick={() => { setPeriod('Últimos 30 dias'); setAnchorEl(null); }}>Últimos 30 dias</MenuItem>
          </Menu>

          <Button variant="contained" startIcon={<DownloadIcon />}>Exportar PDF</Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Faturamento', value: 'R$ 124.500', trend: '+12% vs mês anterior', color: theme.palette.primary.main },
          { title: 'Veículos Ativos', value: '1,245', trend: '+5 novos esta semana', color: theme.palette.secondary.main },
          { title: 'Clientes', value: '48', trend: 'Taxa de churn 0%', color: '#00e676' },
          { title: 'Alertas Críticos', value: '3', trend: 'Requer atenção imediata', color: '#ff1744' },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i} component={motion.div} variants={itemVariants}>
            <StatCard 
              title={stat.title} 
              value={stat.value} 
              icon={<Typography variant="caption" sx={{ fontWeight:'bold' }}>{stat.trend}</Typography>} 
              color={stat.color} 
            />
          </Grid>
        ))}
      </Grid>

      {/* Gráficos Principais */}
      <Grid container spacing={3}>
        {/* Receita x Custo */}
        <Grid item xs={12} lg={8} component={motion.div} variants={itemVariants}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 3, position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Performance Financeira</Typography>
                <IconButton size="small"><MoreVertIcon /></IconButton>
            </Box>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#aaa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#aaa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} 
                    itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Area type="monotone" dataKey="receita" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#colorRec)" name="Receita" />
                <Area type="monotone" dataKey="custo" stroke={theme.palette.secondary.main} strokeWidth={3} fill="transparent" name="Custo" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Status da Frota (Pie Chart) */}
        <Grid item xs={12} lg={4} component={motion.div} variants={itemVariants}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Status da Frota</Typography>
            <Box sx={{ height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
                </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;