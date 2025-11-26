// Local: src/layouts/FilialLayout.jsx

import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Toolbar, AppBar, Typography, Button, Drawer, List, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, 
  InputBase, Badge, IconButton, Avatar, Divider 
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

// Ícones
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import MapIcon from '@mui/icons-material/Map';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CommuteIcon from '@mui/icons-material/Commute';
import BadgeIcon from '@mui/icons-material/Badge';
import PaletteIcon from '@mui/icons-material/Palette';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';

const drawerWidth = 260;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.10) },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  border: '1px solid rgba(255,255,255,0.1)',
  [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(3), width: 'auto' },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2), height: '100%', position: 'absolute',
  pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: { width: '40ch' },
  },
}));

const FilialLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Visão Geral', path: '/filial/dashboard', icon: <SpaceDashboardIcon /> },
    { label: 'Monitoramento', path: '/filial/monitoramento', icon: <MapIcon /> },
    { label: 'Meus Clientes', path: '/filial/clientes', icon: <GroupAddIcon /> },
    { label: 'Veículos', path: '/filial/veiculos', icon: <CommuteIcon /> },
    { label: 'Motoristas', path: '/filial/motoristas', icon: <BadgeIcon /> },
    { label: 'Personalização', path: '/filial/personalizacao', icon: <PaletteIcon /> },
  ];

  // URL da Logo (se existir)
  const logoUrl = user?.attributes?.logo ? `https://fleetvision.com.br${user.attributes.logo}` : null;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, 
        backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 20, 35, 0.95) !important',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
      }}>
        <Toolbar>
          {/* LOGO OU TÍTULO */}
          <Box sx={{ minWidth: drawerWidth - 40, display: 'flex', alignItems: 'center' }}>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" style={{ maxHeight: 40, objectFit: 'contain' }} />
            ) : (
              <Typography variant="h6" noWrap component="div" sx={{ 
                fontWeight: '900', background: 'linear-gradient(90deg, #00e5ff 0%, #00b0ff 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1
              }}>
                {user?.name || 'FILIAL'}
              </Typography>
            )}
          </Box>

          <Search>
            <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
            <StyledInputBase placeholder="Buscar..." inputProps={{ 'aria-label': 'search' }} />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="large" color="inherit"><Badge badgeContent={2} color="error"><NotificationsIcon /></Badge></IconButton>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
               <Typography variant="body2" sx={{ mr: 1, fontWeight: 'bold', color: '#fff', display:{xs:'none', md:'block'} }}>
                 {user?.email}
               </Typography>
               <Avatar sx={{ width: 32, height: 32, bgcolor: '#00e5ff', color: '#000' }}><AccountCircle /></Avatar>
            </Box>
            <Button color="error" variant="outlined" startIcon={<LogoutIcon />} onClick={logout} size="small" sx={{ borderRadius: 1 }}>Sair</Button>
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
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton onClick={() => navigate(item.path)} selected={isActive} sx={{
                    borderRadius: 1,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                    backgroundColor: isActive ? 'rgba(0, 229, 255, 0.15) !important' : 'transparent',
                    borderLeft: isActive ? '4px solid #00e5ff' : '4px solid transparent',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff' }
                  }}>
                    <ListItemIcon sx={{ color: isActive ? '#00e5ff' : 'rgba(255,255,255,0.4)', minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 'bold' : 'medium' }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, overflow: 'hidden' }}><Outlet /></Box>
    </Box>
  );
};

export default FilialLayout;