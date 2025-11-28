import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppThemeProvider } from './context/ThemeContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { CircularProgress, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 1, // 1 minuto de cache
      retry: 1,
    },
  },
});

// --- Lazy Imports (Code Splitting) ---
const LoginPage = lazy(() => import('./pages/LoginPage'));
const BrandingPage = lazy(() => import('./pages/BrandingPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Layouts
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const FilialLayout = lazy(() => import('./layouts/FilialLayout'));
const ClientLayout = lazy(() => import('./layouts/ClientLayout'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminMapPage = lazy(() => import('./pages/admin/AdminMapPage'));
const FiliaisPage = lazy(() => import('./pages/admin/FiliaisPage'));
const ClientesAdminPage = lazy(() => import('./pages/admin/ClientesAdminPage'));
const FinancialPage = lazy(() => import('./pages/admin/FinancialPage'));
const AuditLogsPage = lazy(() => import('./pages/admin/AuditLogsPage'));

// Filial Pages
const FilialDashboardPage = lazy(() => import('./pages/filial/FilialDashboardPage'));
const FilialMapPage = lazy(() => import('./pages/filial/FilialMapPage'));
const ClientesPage = lazy(() => import('./pages/filial/ClientesPage'));
const ClientDetailPage = lazy(() => import('./pages/filial/ClientDetailPage'));
const VeiculosPage = lazy(() => import('./pages/filial/VeiculosPage'));
const DriversPage = lazy(() => import('./pages/filial/DriversPage'));

// Client Pages
const ClientDashboardPage = lazy(() => import('./pages/ClientDashboardPage'));
const ClientMapPage = lazy(() => import('./pages/ClientMapPage'));
const ClientReportsPage = lazy(() => import('./pages/ClientReportsPage'));
const ClientVehiclesPage = lazy(() => import('./pages/ClientVehiclesPage'));
const ClientVehicleDetailsPage = lazy(() => import('./pages/ClientVehicleDetailsPage'));
const EditVehiclePage = lazy(() => import('./pages/EditVehiclePage'));
const GeofencesPage = lazy(() => import('./pages/GeofencesPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));

// Loading Fallback
const LoadingScreen = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
    <CircularProgress color="primary" />
  </Box>
);

// Guards
const ProtectedRoute = ({ children }) => { const { user, loadingSession } = useAuth(); if (loadingSession) return null; if (!user) return <Navigate to="/" />; return children; };
const AdminProtectedRoute = () => { const { user } = useAuth(); if (!user || !user.administrator) return <Navigate to="/" />; return <Outlet />; };
const FilialProtectedRoute = () => { const { user } = useAuth(); if (!user || (user.attributes?.role !== 'filial' && !user.administrator)) return <Navigate to="/" />; return <Outlet />; };

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <Suspense fallback={<LoadingScreen />}>
            {/* Sistema de Notificações Global */}
            <Toaster position="top-right" richColors closeButton theme="system" />
            
            <Routes>
              <Route path="/" element={<LoginPage />} />
              
              {/* ADMIN ROUTES */}
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                   <Route path="dashboard" element={<AdminDashboard />} />
                   <Route path="monitoramento" element={<AdminMapPage />} />
                   <Route path="filiais" element={<FiliaisPage />} />
                   <Route path="clientes" element={<ClientesAdminPage />} />
                   <Route path="financeiro" element={<FinancialPage />} />
                   <Route path="auditoria" element={<AuditLogsPage />} />
                   <Route path="personalizacao" element={<BrandingPage />} />
                   <Route path="configuracoes" element={<SettingsPage />} />
                   <Route index element={<Navigate to="dashboard" />} />
                </Route>
              </Route>

              {/* FILIAL ROUTES */}
              <Route element={<FilialProtectedRoute />}>
                <Route path="/filial" element={<FilialLayout />}>
                   <Route path="dashboard" element={<FilialDashboardPage />} />
                   <Route path="monitoramento" element={<FilialMapPage />} />
                   <Route path="clientes" element={<ClientesPage />} />
                   <Route path="clientes/:clientId" element={<ClientDetailPage />} />
                   <Route path="veiculos" element={<VeiculosPage />} />
                   <Route path="motoristas" element={<DriversPage />} />
                   <Route path="personalizacao" element={<BrandingPage />} />
                   <Route path="configuracoes" element={<SettingsPage />} />
                   <Route index element={<Navigate to="dashboard" />} />
                </Route>
              </Route>

              {/* CLIENT ROUTES */}
              <Route path="/dashboard" element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
                 <Route path="overview" element={<ClientDashboardPage />} />
                 <Route path="map" element={<ClientMapPage />} />
                 <Route path="reports" element={<ClientReportsPage />} />
                 <Route path="vehicles" element={<ClientVehiclesPage />} />
                 <Route path="vehicles/:vehicleId" element={<ClientVehicleDetailsPage />} />
                 <Route path="vehicles/edit/:vehicleId" element={<EditVehiclePage />} />
                 <Route path="geofences" element={<GeofencesPage />} />
                 <Route path="notifications" element={<NotificationsPage />} />
                 <Route path="configuracoes" element={<SettingsPage />} />
                 <Route index element={<Navigate to="overview" />} />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </LocalizationProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

export default App;