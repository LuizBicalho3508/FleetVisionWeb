import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { CircularProgress, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import OfflineBanner from './components/common/OfflineBanner';

// ... (Configuração do QueryClient e LoadingScreen mantidos)
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, staleTime: 60000, retry: 1 } },
});

const LoadingScreen = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
    <CircularProgress color="primary" />
  </Box>
);

const ProtectedRoute = ({ children }) => { const { user, loadingSession } = useAuth(); if (loadingSession) return null; if (!user) return <Navigate to="/" />; return children; };
const AdminProtectedRoute = () => { const { user } = useAuth(); if (!user || !user.administrator) return <Navigate to="/" />; return <Outlet />; };
const FilialProtectedRoute = () => { const { user } = useAuth(); if (!user || (user.attributes?.role !== 'filial' && !user.administrator)) return <Navigate to="/" />; return <Outlet />; };

// Lazy Imports (Fase 1-4 existentes + Fase 5)
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminMapPage = lazy(() => import('./pages/admin/AdminMapPage'));
const FiliaisPage = lazy(() => import('./pages/admin/FiliaisPage'));
const VehicleDetailsPro = lazy(() => import('./pages/admin/VehicleDetailsPro'));
const IntegrationsPage = lazy(() => import('./pages/admin/IntegrationsPage'));
const SystemStatusPage = lazy(() => import('./pages/admin/SystemStatusPage')); // <--- NOVO (Fase 5)

const FilialLayout = lazy(() => import('./layouts/FilialLayout'));
const FilialDashboardPage = lazy(() => import('./pages/filial/FilialDashboardPage'));
const FilialMapPage = lazy(() => import('./pages/filial/FilialMapPage'));
const ClientesPage = lazy(() => import('./pages/filial/ClientesPage'));
const VeiculosPage = lazy(() => import('./pages/filial/VeiculosPage'));
const SubscriptionPlansPage = lazy(() => import('./pages/filial/SubscriptionPlansPage')); // <--- NOVO (Fase 5)

const ClientLayout = lazy(() => import('./layouts/ClientLayout'));
const ClientDashboardPage = lazy(() => import('./pages/ClientDashboardPage'));
const ClientMapPage = lazy(() => import('./pages/ClientMapPage'));
const ClientVehiclesPage = lazy(() => import('./pages/ClientVehiclesPage'));
const ClientReportsPage = lazy(() => import('./pages/ClientReportsPage'));
const ClientFuelPage = lazy(() => import('./pages/ClientFuelPage')); // <--- NOVO (Fase 5)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <NotificationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <Suspense fallback={<LoadingScreen />}>
              <Toaster position="top-right" richColors closeButton theme="system" />
              <OfflineBanner />
              
              <Routes>
                <Route path="/" element={<LoginPage />} />
                
                {/* ADMIN */}
                <Route element={<AdminProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                     <Route path="dashboard" element={<AdminDashboard />} />
                     <Route path="monitoramento" element={<AdminMapPage />} />
                     <Route path="filiais" element={<FiliaisPage />} />
                     <Route path="veiculos/:vehicleId" element={<VehicleDetailsPro />} />
                     <Route path="integracoes" element={<IntegrationsPage />} />
                     <Route path="status" element={<SystemStatusPage />} /> {/* Nova Rota */}
                     <Route index element={<Navigate to="dashboard" />} />
                  </Route>
                </Route>

                {/* FILIAL */}
                <Route element={<FilialProtectedRoute />}>
                  <Route path="/filial" element={<FilialLayout />}>
                     <Route path="dashboard" element={<FilialDashboardPage />} />
                     <Route path="monitoramento" element={<FilialMapPage />} />
                     <Route path="clientes" element={<ClientesPage />} />
                     <Route path="veiculos" element={<VeiculosPage />} />
                     <Route path="planos" element={<SubscriptionPlansPage />} /> {/* Nova Rota */}
                     <Route index element={<Navigate to="dashboard" />} />
                  </Route>
                </Route>

                {/* CLIENTE */}
                <Route path="/dashboard" element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
                   <Route path="overview" element={<ClientDashboardPage />} />
                   <Route path="map" element={<ClientMapPage />} />
                   <Route path="vehicles" element={<ClientVehiclesPage />} />
                   <Route path="reports" element={<ClientReportsPage />} />
                   <Route path="fuel" element={<ClientFuelPage />} /> {/* Nova Rota */}
                   <Route index element={<Navigate to="overview" />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </LocalizationProvider>
        </NotificationProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

export default App;