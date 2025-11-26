import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, CircularProgress, Paper } from '@mui/material';
import StatCard from '../../components/dashboard/StatCard';
import apiClient from '../../api/apiClient';
import dayjs from 'dayjs';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend, BarChart, Bar 
} from 'recharts';

// Ícones
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [opsStats, setOpsStats] = useState({ filiais: 0, clientes: 0, devices: 0, online: 0 });
  const [finStats, setFinStats] = useState({ contractsActive: 0, contractsExpiring: 0, contractsExpired: 0, mrr: 0 });
  const [financialData, setFinancialData] = useState([]);
  const [communicationData, setCommunicationData] = useState([]);
  const [growthData, setGrowthData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, devicesRes] = await Promise.all([
        apiClient.get('/users'),
        apiClient.get('/devices')
      ]);

      const users = usersRes.data;
      const devices = devicesRes.data;
      const filiais = users.filter(u => u.attributes?.role === 'filial');

      // 1. KPIs Operacionais
      setOpsStats({
        filiais: filiais.length,
        clientes: users.filter(u => u.attributes?.role === 'cliente').length,
        devices: devices.length,
        online: devices.filter(d => d.status === 'online').length
      });

      // 2. KPIs Financeiros
      const now = dayjs();
      let active = 0, expiring = 0, expired = 0, currentMRR = 0;

      filiais.forEach(f => {
        const end = f.attributes?.contractEnd ? dayjs(f.attributes.contractEnd) : null;
        if (end) {
          if (end.isBefore(now, 'day')) expired++;
          else if (end.isSame(now, 'month')) expiring++;
          else active++;
        }
        
        // Cálculo de MRR Real
        const clients = users.filter(u => String(u.attributes?.filialId) === String(f.id));
        const clientIds = clients.map(c => String(c.id));
        const activeDevs = devices.filter(d => clientIds.includes(String(d.attributes?.ownerId)) && !d.disabled).length;
        const price = parseFloat(f.attributes?.pricePerDevice || 0);
        currentMRR += activeDevs * price;
      });

      setFinStats({ contractsActive: active, contractsExpiring: expiring, contractsExpired: expired, mrr: currentMRR });

      // 3. Gráfico Pizza (Real)
      let commToday = 0, commOffline = 0, commLost = 0;
      devices.forEach(d => {
        if (!d.lastUpdate) { commLost++; return; }
        const lastUpdate = dayjs(d.lastUpdate);
        const diffDays = now.diff(lastUpdate, 'day');
        if (lastUpdate.isSame(now, 'day')) commToday++;
        else if (diffDays > 7) commLost++;
        else commOffline++;
      });
      setCommunicationData([
        { name: 'Conectados', value: commToday, color: '#00e676' },
        { name: 'Ociosos', value: commOffline, color: '#ff9100' },
        { name: 'Perdidos', value: commLost, color: '#ff1744' },
      ]);

      // 4. Gráfico Faturamento (Projeção baseada no MRR atual)
      const finData = [];
      for (let i = 11; i >= 0; i--) {
        const date = dayjs().subtract(i, 'month');
        // Aplica uma curva de crescimento suave para trás
        const factor = 1 - (i * 0.02); 
        finData.push({ name: date.format('MMM'), value: Math.floor(currentMRR * (factor > 0 ? factor : 0)) });
      }
      setFinancialData(finData);

      // Procure a seção "// 5. Crescimento (Barras)" dentro do useEffect fetchData e substitua por:

      // 5. Crescimento da Base (Lógica Real baseada em registrationDate)
      const growData = [];
      for (let i = 5; i >= 0; i--) {
        const date = dayjs().subtract(i, 'month');
        const startOfMonth = date.startOf('month');
        const endOfMonth = date.endOf('month');

        // Total de veículos ativos até o final daquele mês
        const totalAtDate = devices.filter(d => {
            const regDate = d.attributes?.registrationDate ? dayjs(d.attributes.registrationDate) : null;
            // Se tiver data de registro, usa. Se não, considera que sempre existiu (fallback)
            if (regDate) return regDate.isBefore(endOfMonth);
            return true; // Fallback para legados
        }).length;

        // Novos veículos naquele mês específico
        const newAtDate = devices.filter(d => {
            const regDate = d.attributes?.registrationDate ? dayjs(d.attributes.registrationDate) : null;
            if (regDate) return regDate.isSame(date, 'month');
            return false; 
        }).length;

        growData.push({
          name: date.format('MMM'),
          total: totalAtDate,
          novos: newAtDate
        });
      }
      setGrowthData(growData);

    } catch (error) {
      console.error("Erro dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const paperStyle = {
    p: 3, height: '100%', 
    background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(12px)', 
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1,
    display: 'flex', flexDirection: 'column'
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        
        {/* === COLUNA ESQUERDA (OPERACIONAL - 66%) === */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Cards Operacionais */}
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#fff', mb: 2, borderLeft: '4px solid #00e5ff', pl: 1, fontWeight:'bold' }}>MÉTRICAS OPERACIONAIS</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}><StatCard title="Filiais" value={opsStats.filiais} icon={<BusinessIcon />} color="#00e5ff" /></Grid>
                <Grid item xs={6} md={3}><StatCard title="Clientes" value={opsStats.clientes} icon={<GroupIcon />} color="#7c4dff" /></Grid>
                <Grid item xs={6} md={3}><StatCard title="Frota Total" value={opsStats.devices} icon={<DirectionsCarIcon />} color="#00b0ff" /></Grid>
                <Grid item xs={6} md={3}><StatCard title="Online" value={opsStats.online} icon={<CheckCircleIcon />} color="#00e676" /></Grid>
              </Grid>
            </Box>

            {/* Gráfico Crescimento + Pizza (Lado a Lado na coluna esquerda) */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Paper sx={paperStyle}>
                  <Typography variant="subtitle2" sx={{color:'#aaa', mb:1}}>CRESCIMENTO DA FROTA</Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="name" stroke="#aaa" axisLine={false} tickLine={false} />
                      <YAxis stroke="#aaa" axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px' }} cursor={{fill:'rgba(255,255,255,0.05)'}} />
                      <Bar dataKey="total" name="Total" fill="#7c4dff" radius={[4, 4, 0, 0]} barSize={30} />
                      <Bar dataKey="novos" name="Novos" fill="#00e5ff" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={paperStyle}>
                  <Typography variant="subtitle2" sx={{color:'#aaa', mb:1}}>STATUS DE COMUNICAÇÃO</Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={communicationData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                        {communicationData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1a202c' }} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>

          </Box>
        </Grid>

        {/* === COLUNA DIREITA (FINANCEIRO - 33%) === */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
            
            {/* Cards Financeiros */}
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#fff', mb: 2, borderLeft: '4px solid #00e676', pl: 1, fontWeight:'bold' }}>FINANCEIRO</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}><StatCard title="MRR Mensal" value={`R$ ${finStats.mrr.toLocaleString('pt-BR')}`} icon={<MonetizationOnIcon />} color="#00e5ff" /></Grid>
                <Grid item xs={6}><StatCard title="Vigentes" value={finStats.contractsActive} icon={<AssignmentIcon />} color="#00e676" /></Grid>
                <Grid item xs={6}><StatCard title="A Vencer" value={finStats.contractsExpiring} icon={<AssignmentLateIcon />} color="#ff9100" /></Grid>
                <Grid item xs={6}><StatCard title="Vencidos" value={finStats.contractsExpired} icon={<EventBusyIcon />} color="#ff1744" /></Grid>
              </Grid>
            </Box>

            {/* Gráfico Faturamento (Abaixo dos cards financeiros) */}
            <Box sx={{ flexGrow: 1 }}>
              <Paper sx={{ ...paperStyle, minHeight: 300, height: '100%' }}>
                <Typography variant="subtitle2" sx={{color:'#aaa', mb:1}}>PROJEÇÃO DE FATURAMENTO</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financialData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="#aaa" axisLine={false} tickLine={false} fontSize={10} />
                    <YAxis stroke="#aaa" axisLine={false} tickLine={false} fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a202c' }} />
                    <Area type="monotone" dataKey="value" stroke="#00e5ff" strokeWidth={3} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Box>

          </Box>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AdminDashboard;