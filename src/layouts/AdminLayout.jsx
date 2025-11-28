import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { 
  Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, Avatar, Tooltip, Breadcrumbs, 
  Link, Badge, Menu, MenuItem, Divider, useMediaQuery, useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { useLiveFleet } from '../hooks/useLiveFleet';
import PermissionGate from '../components/common/PermissionGate';
import { PERMISSIONS } from '../config/roles';

// Ícones
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import MapIcon from '@mui/icons-material/Map';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HistoryIcon from '@mui/icons-material/History';
import PaletteIcon from '@mui/icons-material/Palette';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SettingsIcon from '@mui/icons-material/Settings';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED_WIDTH = 72;

const menuItems = [
  { label: 'Visão Geral', path: '/admin/dashboard', icon: <DashboardIcon />, permission: PERMISSIONS.VIEW_REPORTS },
  { label: 'Monitoramento', path: '/admin/monitoramento', icon: <MapIcon />, permission: PERMISSIONS.VIEW_MAP },
  { label: 'Filiais', path: '/admin/filiais', icon: <BusinessIcon />, permission: PERMISSIONS.MANAGE_USERS },
  { label: 'Clientes', path: '/admin/clientes', icon: <PeopleIcon />, permission: PERMISSIONS.VIEW_USERS },
  { label: 'Financeiro', path: '/admin/financeiro', icon: <AttachMoneyIcon />, permission: PERMISSIONS.VIEW_FINANCIAL },
  { label: 'Auditoria', path: '/admin/auditoria', icon: <HistoryIcon />, permission: PERMISSIONS.VIEW_AUDIT },
  { label: 'Personalização', path: '/admin/personalizacao', icon: <PaletteIcon />, permission: PERMISSIONS.MANAGE_BRANDING },
  { label: 'Configurações', path: '/admin/configuracoes', icon: <SettingsIcon />, permission: null }, // Sempre visível
];

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  const { user, logout } = useAuth();
  const { toggleTheme, mode } = useAppTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // ATIVA A TELEMETRIA EM TEMPO REAL PARA TODO O PAINEL ADMIN
  useLiveFleet();

  const handleDrawerToggle = () => {
    if (isMobile) setMobileOpen(!mobileOpen);
    else setCollapsed(!collapsed);
  };

  const pathnames = location.pathname.split('/').filter((x) => x);

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ 
        p: 2, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
        borderBottom: `1px solid ${theme.palette.divider}`, minHeight: 64
      }}>
        {!collapsed && !isMobile ? (
           <Typography variant="h6" sx={{ 
             background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
             WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, letterSpacing: 1
           }}>
             FLEET VISION
           </Typography>
        ) : (
           <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'primary.main' }} /> 
        )}
      </Box>

      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          const MenuItemContent = (
            <Tooltip title={collapsed ? item.label : ''} placement="right" arrow>
              <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
                <ListItemButton
                  onClick={() => { navigate(item.path); if(isMobile) setMobileOpen(false); }}
                  selected={isActive}
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? 'center' : 'initial',
                    borderRadius: 2,
                    px: 2.5,
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                    '&.Mui-selected': { bgcolor: alpha(theme.palette.primary.main, 0.15) }
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center',
                    color: isActive ? 'primary.main' : 'inherit'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: collapsed ? 0 : 1, display: collapsed ? 'none' : 'block' }} />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );

          // Se tiver permissão definida, usa o Gate. Se for null, renderiza sempre.
          if (item.permission) {
            return (
              <PermissionGate key={item.path} permissions={item.permission}>
                {MenuItemContent}
              </PermissionGate>
            );
          }
          return <React.Fragment key={item.path}>{MenuItemContent}</React.Fragment>;
        })}
      </List>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ p: collapsed ? 1 : 2, textAlign: collapsed ? 'center' : 'left' }}>
         <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
         </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: { md: `calc(100% - ${collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH}px)` },
        ml: { md: `${collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH}px` },
        bgcolor: 'background.paper', color: 'text.primary',
        borderBottom: `1px solid ${theme.palette.divider}`, boxShadow: 'none', transition: 'width 0.2s'
      }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            {isMobile ? <MenuIcon /> : (collapsed ? <MenuIcon /> : <MenuOpenIcon />)}
          </IconButton>

          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Link component={RouterLink} underline="hover" color="inherit" to="/admin">Admin</Link>
            {pathnames.slice(1).map((value, index) => {
              const last = index === pathnames.length - 2;
              const to = `/${pathnames.slice(0, index + 2).join('/')}`;
              return last ? (
                <Typography color="text.primary" key={to} sx={{ textTransform: 'capitalize' }}>{value}</Typography>
              ) : (
                <Link component={RouterLink} underline="hover" color="inherit" to={to} key={to} sx={{ textTransform: 'capitalize' }}>
                  {value}
                </Link>
              );
            })}
          </Breadcrumbs>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton size="large" color="inherit">
            <Badge badgeContent={4} color="error"><NotificationsIcon /></Badge>
          </IconButton>

          <Box sx={{ ml: 2 }}>
            <Tooltip title="Configurações da Conta">
              <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>{user?.name?.charAt(0)}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={() => setAnchorElUser(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem disabled><Typography textAlign="center">{user?.email}</Typography></MenuItem>
              <Divider />
              <MenuItem onClick={logout} sx={{ color: 'error.main' }}>
                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText>Sair</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH,
              transition: 'width 0.2s',
              overflowX: 'hidden',
              borderRight: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.default'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ 
        flexGrow: 1, p: 3, mt: 8, 
        width: { md: `calc(100% - ${collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH}px)` },
        transition: 'width 0.2s'
      }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;