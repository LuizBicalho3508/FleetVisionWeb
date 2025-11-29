import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { 
  Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, Avatar, Tooltip, Breadcrumbs, 
  Link, Badge, Menu, MenuItem, Divider, useMediaQuery, useTheme, Container
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

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 80;

const menuItems = [
  { label: 'Visão Geral', path: '/admin/dashboard', icon: <DashboardIcon />, permission: PERMISSIONS.VIEW_REPORTS },
  { label: 'Monitoramento', path: '/admin/monitoramento', icon: <MapIcon />, permission: PERMISSIONS.VIEW_MAP },
  { label: 'Filiais', path: '/admin/filiais', icon: <BusinessIcon />, permission: PERMISSIONS.MANAGE_USERS },
  { label: 'Clientes', path: '/admin/clientes', icon: <PeopleIcon />, permission: PERMISSIONS.VIEW_USERS },
  { label: 'Financeiro', path: '/admin/financeiro', icon: <AttachMoneyIcon />, permission: PERMISSIONS.VIEW_FINANCIAL },
  { label: 'Auditoria', path: '/admin/auditoria', icon: <HistoryIcon />, permission: PERMISSIONS.VIEW_AUDIT },
  { label: 'Personalização', path: '/admin/personalizacao', icon: <PaletteIcon />, permission: PERMISSIONS.MANAGE_BRANDING },
  { label: 'Configurações', path: '/admin/configuracoes', icon: <SettingsIcon />, permission: null },
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

  useLiveFleet();

  const handleDrawerToggle = () => {
    if (isMobile) setMobileOpen(!mobileOpen);
    else setCollapsed(!collapsed);
  };

  // Breadcrumbs Dinâmicos
  const pathnames = location.pathname.split('/').filter((x) => x);

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header da Sidebar */}
      <Box sx={{ 
        p: 3, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight: 70
      }}>
        {!collapsed ? (
           <Typography variant="h6" sx={{ 
             background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
             WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, letterSpacing: 1
           }}>
             FLEET VISION
           </Typography>
        ) : (
           <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'primary.main', boxShadow: '0 0 10px rgba(0,229,255,0.5)' }} /> 
        )}
      </Box>

      {/* Lista de Menu */}
      <List sx={{ flexGrow: 1, px: 2, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          const MenuItemContent = (
            <Tooltip title={collapsed ? item.label : ''} placement="right" arrow>
              <ListItem disablePadding sx={{ display: 'block', mb: 1 }}>
                <ListItemButton
                  onClick={() => { navigate(item.path); if(isMobile) setMobileOpen(false); }}
                  selected={isActive}
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? 'center' : 'initial',
                    borderRadius: 3,
                    px: 2.5,
                    transition: 'all 0.2s',
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      transform: 'translateX(4px)'
                    },
                    '&.Mui-selected': { bgcolor: alpha(theme.palette.primary.main, 0.15) }
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center',
                    color: isActive ? 'primary.main' : 'inherit'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    sx={{ opacity: collapsed ? 0 : 1, display: collapsed ? 'none' : 'block' }} 
                    primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }}
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );

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
      
      <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.05)' }} />
      
      {/* Footer da Sidebar */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: collapsed ? 'column' : 'row', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
         <IconButton onClick={toggleTheme} color="inherit" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
            {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
         </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Topbar */}
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: { md: `calc(100% - ${collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH}px)` },
        ml: { md: `${collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH}px` },
        bgcolor: alpha(theme.palette.background.default, 0.8), 
        backdropFilter: 'blur(12px)',
        color: 'text.primary',
        borderBottom: `1px solid ${theme.palette.divider}`, 
        boxShadow: 'none', 
        transition: 'width 0.3s ease'
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
              return (
                <Typography key={to} color={last ? "text.primary" : "inherit"} sx={{ textTransform: 'capitalize', fontWeight: last ? 'bold' : 'normal' }}>
                  {value}
                </Typography>
              );
            })}
          </Breadcrumbs>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error"><NotificationsIcon /></Badge>
            </IconButton>

            <Tooltip title="Configurações da Conta">
              <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0, border: `2px solid ${theme.palette.primary.main}` }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }} src={user?.attributes?.avatar}>{user?.name?.charAt(0)}</Avatar>
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
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" noWrap>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap>{user?.email}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => navigate('/admin/configuracoes')}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Minha Conta</ListItemText>
              </MenuItem>
              <MenuItem onClick={logout} sx={{ color: 'error.main' }}>
                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText>Sair</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box component="nav" sx={{ width: { md: collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH }, flexShrink: { md: 0 }, transition: 'width 0.3s ease' }}>
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
              transition: 'width 0.3s ease',
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

      {/* Main Content Area */}
      <Box component="main" sx={{ 
        flexGrow: 1, p: { xs: 2, md: 4 }, mt: 8, 
        width: { md: `calc(100% - ${collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH}px)` },
        transition: 'width 0.3s ease',
        minHeight: '100vh'
      }}>
        {/* Container para limitar a largura em telas muito grandes (UX de Leitura) */}
        <Container maxWidth="xl" disableGutters>
           <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;