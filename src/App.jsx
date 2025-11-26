// Local: src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useAuth } from './context/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';

// Pages
import LoginPage from './pages/LoginPage';
import BrandingPage from './pages/BrandingPage'; // Personalização

// Layouts
import AdminLayout from './layouts/AdminLayout';
import FilialLayout from './layouts/FilialLayout';
import ClientLayout from './layouts/ClientLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMapPage from './pages/admin/AdminMapPage';
import FiliaisPage from './pages/admin/FiliaisPage';
import ClientesAdminPage from './pages/admin/ClientesAdminPage';
import FinancialPage from './pages/admin/FinancialPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

// Filial Pages
import FilialDashboardPage from './pages/filial/FilialDashboardPage';
import FilialMapPage from './pages/filial/FilialMapPage';
import ClientesPage from './pages/filial/ClientesPage';
import ClientDetailPage from './pages/filial/ClientDetailPage';
import VeiculosPage from './pages/filial/VeiculosPage';
import DriversPage from './pages/filial/DriversPage';

// Client Pages
import ClientDashboardPage from './pages/ClientDashboardPage';
import ClientMapPage from './pages/ClientMapPage';
import ClientReportsPage from './pages/ClientReportsPage';
import ClientVehiclesPage from './pages/ClientVehiclesPage';
import EditVehiclePage from './pages/EditVehiclePage';
import GeofencesPage from './pages/GeofencesPage';
import NotificationsPage from './pages/NotificationsPage';

const glassTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00e5ff' },
    secondary: { main: '#7c4dff' },
    background: { default: 'transparent', paper: 'rgba(20, 27, 45, 0.85)' },
    text: { primary: '#ffffff', secondary: 'rgba(255, 255, 255, 0.7)' },
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 13,
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { background: 'radial-gradient(circle at center, #1a202c 0%, #000000 100%) fixed', minHeight: '100vh' } } },
    MuiAppBar: { styleOverrides: { root: { backgroundColor: 'rgba(15, 20, 35, 0.95) !important', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: 'none' } } },
    MuiDrawer: { styleOverrides: { paper: { borderRight: '1px solid rgba(255, 255, 255, 0.08)' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none', border: '1px solid rgba(255, 255, 255, 0.08)' } } },
    MuiButton: { styleOverrides: { contained: { background: 'linear-gradient(180deg, #00e5ff 0%, #00b0ff 100%)', color: '#000', boxShadow: 'none' } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 4 } } }
  },
});

const ProtectedRoute = ({ children }) => { const { user, loadingSession } = useAuth(); if (loadingSession) return null; if (!user) return <Navigate to="/" />; return children; };
const AdminProtectedRoute = () => { const { user } = useAuth(); if (!user || !user.administrator) return <Navigate to="/" />; return <Outlet />; };
const FilialProtectedRoute = () => { const { user } = useAuth(); if (!user || (user.attributes?.role !== 'filial' && !user.administrator)) return <Navigate to="/" />; return <Outlet />; };

function App() {
  // Efeito para carregar Favicon dinâmico
  useEffect(() => {
    const userStr = localStorage.getItem('traccar_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.attributes?.favicon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = `https://fleetvision.com.br${user.attributes.favicon}`;
      }
    }
  }, []);

  return (
    <ThemeProvider theme={glassTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
               <Route path="dashboard" element={<AdminDashboard />} />
               <Route path="monitoramento" element={<AdminMapPage />} />
               <Route path="filiais" element={<FiliaisPage />} />
               <Route path="clientes" element={<ClientesAdminPage />} />
               <Route path="financeiro" element={<FinancialPage />} />
               <Route path="auditoria" element={<AuditLogsPage />} />
               <Route path="personalizacao" element={<BrandingPage />} />
               <Route index element={<Navigate to="dashboard" />} />
            </Route>
          </Route>

          <Route element={<FilialProtectedRoute />}>
            <Route path="/filial" element={<FilialLayout />}>
               <Route path="dashboard" element={<FilialDashboardPage />} />
               <Route path="monitoramento" element={<FilialMapPage />} />
               <Route path="clientes" element={<ClientesPage />} />
               <Route path="clientes/:clientId" element={<ClientDetailPage />} />
               <Route path="veiculos" element={<VeiculosPage />} />
               <Route path="motoristas" element={<DriversPage />} />
               <Route path="personalizacao" element={<BrandingPage />} />
               <Route index element={<Navigate to="dashboard" />} />
            </Route>
          </Route>

          <Route path="/dashboard" element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
             <Route path="overview" element={<ClientDashboardPage />} />
             <Route path="map" element={<ClientMapPage />} />
             <Route path="reports" element={<ClientReportsPage />} />
             <Route path="vehicles" element={<ClientVehiclesPage />} />
             <Route path="vehicles/edit/:vehicleId" element={<EditVehiclePage />} />
             <Route path="geofences" element={<GeofencesPage />} />
             <Route path="notifications" element={<NotificationsPage />} />
             <Route index element={<Navigate to="overview" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;