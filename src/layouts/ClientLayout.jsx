// Local: src/layouts/ClientLayout.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Toolbar, AppBar, Typography, Button, Drawer, List, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, 
  IconButton, Avatar, Divider, CircularProgress 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import dayjs from 'dayjs';

// Ícones
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FenceIcon from '@mui/icons-material/Fence';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

const drawerWidth = 260;

const ClientLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mantemos a lógica de carregar dados globais para o contexto
  const [liveDevices, setLiveDevices] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSharedData = useCallback(async () => {
    try {
      const [devicesRes, positionsRes] = await Promise.all([
        apiClient.get('/devices'),
        apiClient.get('/positions')
      ]);
      
      const positionsMap = new Map(positionsRes.data.map(pos => [pos.deviceId, pos]));
      const combined = devicesRes.data.map(d => {
        const pos = positionsMap.get(d.id);
        return pos ? { ...d, ...pos } : { ...d, status: d.status || 'offline' };
      });
      setLiveDevices(combined);

      if (devicesRes.data.length > 0) {
        const summaryRes = await apiClient.get('/reports/summary', {
          params: { deviceId: devicesRes.data.map(d=>d.id), from: dayjs().startOf('day').toISOString(), to: dayjs().endOf('day').toISOString() }
        });
        const total = summaryRes.data.reduce((acc, r) => ({ dist: acc.dist + r.distance, eng: acc.eng + r.engineHours }), { dist: 0, eng: 0 });
        setSummaryData({ distance: total.dist, engineHours: total.eng });
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchSharedData();
    const i = setInterval(fetchSharedData, 15000);
    return () => clearInterval(i);
  }, [fetchSharedData]);

  const menuItems = [
    { label: 'Visão Geral', path: '/dashboard/overview', icon: <DashboardIcon /> },
    { label: 'Mapa Tempo Real', path: '/dashboard/map', icon: <MapIcon /> },
    { label: 'Relatórios', path: '/dashboard/reports', icon: <AssessmentIcon /> },
    { type: 'divider' },
    { label: 'Meus Veículos', path: '/dashboard/vehicles', icon: <DirectionsCarIcon /> },
    { label: 'Cercas Virtuais', path: '/dashboard/geofences', icon: <FenceIcon /> },
    { label: 'Meus Alertas', path: '/dashboard/notifications', icon: <NotificationsIcon /> },
  ];

  if (loading) return <Box sx={{display:'flex', justifyContent:'center', height:'100vh', alignItems:'center'}}><CircularProgress/></Box>;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, 
        backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 20, 35, 0.95) !important',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ 
            fontWeight: '900', color:'#fff', letterSpacing: 1, minWidth: drawerWidth - 40
          }}>
            VISION FLEET
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <Typography variant="body2" sx={{color:'rgba(255,255,255,0.7)', display:{xs:'none',md:'block'}}}>{user?.email}</Typography>
             <Avatar sx={{ width: 32, height: 32, bgcolor: '#7c4dff' }}><PersonIcon /></Avatar>
             <Button color="error" startIcon={<LogoutIcon />} onClick={logout} size="small">Sair</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{
        width: drawerWidth, flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, boxSizing: 'border-box',
          backgroundColor: 'rgba(20, 27, 45, 0.6)', borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)', top: '64px', height: 'calc(100% - 64px)'
        },
      }}>
        <Box sx={{ overflow: 'auto', mt: 3, px: 2 }}>
          <List>
            {menuItems.map((item, index) => {
              if (item.type === 'divider') return <Divider key={index} sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />;
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton onClick={() => navigate(item.path)} selected={isActive} sx={{
                    borderRadius: 1,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                    backgroundColor: isActive ? 'rgba(124, 77, 255, 0.15) !important' : 'transparent', // Roxo para cliente
                    borderLeft: isActive ? '4px solid #7c4dff' : '4px solid transparent',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff' }
                  }}>
                    <ListItemIcon sx={{ color: isActive ? '#7c4dff' : 'rgba(255,255,255,0.4)', minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 'bold' : 'medium' }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, overflow: 'hidden' }}>
        <Outlet context={{ liveDevices, summaryData, fetchSharedData }} />
      </Box>
    </Box>
  );
};

export default ClientLayout;