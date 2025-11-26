// Local: src/layouts/AdminLayout.jsx

import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Toolbar, AppBar, Typography, Button, Drawer, List, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, 
  InputBase, Badge, IconButton, Avatar, Divider 
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

// Ícones de Navegação
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import MapIcon from '@mui/icons-material/Map';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HistoryIcon from '@mui/icons-material/History';
import PaletteIcon from '@mui/icons-material/Palette'; // Personalização

// Ícones do Header
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';

const drawerWidth = 260;

// --- Estilos da Barra de Pesquisa ---
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

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Menu de Navegação Lateral
  const menuItems = [
    { label: 'Visão Geral', path: '/admin/dashboard', icon: <SpaceDashboardIcon /> },
    { label: 'Monitoramento', path: '/admin/monitoramento', icon: <MapIcon /> },
    { label: 'Filiais', path: '/admin/filiais', icon: <BusinessIcon /> },
    { label: 'Clientes Globais', path: '/admin/clientes', icon: <PublicIcon /> },
    { label: 'Financeiro', path: '/admin/financeiro', icon: <AttachMoneyIcon /> },
    { label: 'Auditoria', path: '/admin/auditoria', icon: <HistoryIcon /> },
    { label: 'Personalização', path: '/admin/personalizacao', icon: <PaletteIcon /> },
  ];

  // Verifica se existe logo personalizada salva no usuário
  const logoUrl = user?.attributes?.logo ? `https://fleetvision.com.br${user.attributes.logo}` : null;

  return (
    <Box sx={{ display: 'flex' }}>
      
      {/* --- HEADER (AppBar) --- */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1, 
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(15, 20, 35, 0.95) !important',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        <Toolbar>
          {/* Logo Dinâmica ou Texto */}
          <Box sx={{ minWidth: drawerWidth - 40, display: 'flex', alignItems: 'center' }}>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" style={{ maxHeight: 40, objectFit: 'contain' }} />
            ) : (
              <Typography 
                variant="h5" 
                noWrap 
                component="div" 
                sx={{ 
                  fontWeight: '900', 
                  background: 'linear-gradient(90deg, #00e5ff 0%, #7c4dff 100%)',
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: 2
                }}
              >
                MATRIZ
              </Typography>
            )}
          </Box>

          {/* Barra de Pesquisa */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Pesquisar no sistema..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* Ícones e Perfil */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error"><MailIcon /></Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="error"><NotificationsIcon /></Badge>
            </IconButton>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
               <Box sx={{ textAlign: 'right', mr: 1, display: { xs: 'none', md: 'block' } }}>
                 <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#fff' }}>
                   {user?.name || 'Admin'}
                 </Typography>
                 <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                   Super Admin
                 </Typography>
               </Box>
               <Avatar sx={{ width: 36, height: 36, bgcolor: '#7c4dff' }}>
                 <AccountCircle />
               </Avatar>
            </Box>

            <Button 
              color="error" 
              variant="outlined" 
              startIcon={<LogoutIcon />} 
              onClick={logout}
              size="small"
              sx={{ borderRadius: 1, borderColor: 'rgba(255,23,68,0.5)', color: '#ff1744' }}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- SIDEBAR (Drawer) --- */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            backgroundColor: 'rgba(20, 27, 45, 0.6)', // Vidro mais transparente na sidebar
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            top: '64px', // Abaixo do Header
            height: 'calc(100% - 64px)'
          },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: 3, px: 2 }}>
          <List>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={isActive}
                    sx={{
                      borderRadius: 1, // 4px
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                      backgroundColor: isActive ? 'rgba(0, 229, 255, 0.15) !important' : 'transparent',
                      borderLeft: isActive ? '4px solid #00e5ff' : '4px solid transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: '#fff'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: isActive ? '#00e5ff' : 'rgba(255,255,255,0.4)',
                      minWidth: 40
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{ 
                        fontSize: '0.9rem', 
                        fontWeight: isActive ? 'bold' : 'medium' 
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, overflow: 'hidden' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;