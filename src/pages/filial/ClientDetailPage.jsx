// Local: src/pages/filial/ClientDetailPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Paper, CircularProgress, Button, Tabs, Tab, Grid, 
  IconButton, Chip, Divider 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import apiClient, { adminApiClient } from '../../api/apiClient';
import CreateVeiculoModal from '../../components/filial/CreateVeiculoModal';

// Componente de Tabela de Veículos (Reutilizando lógica visual)
import DeviceDataGrid from '../../components/DeviceDataGrid'; 

const ClientDetailPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [devices, setDevices] = useState([]);
  const [tabIndex, setTabIndex] = useState(0); // 0: Veículos, 1: Dados
  const [isVeiculoModalOpen, setIsVeiculoModalOpen] = useState(false);

  // Busca dados do cliente e seus veículos
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Paraleliza as requisições para performance
      const [usersRes, devicesRes] = await Promise.all([
        apiClient.get('/users'), // Busca usuários
        apiClient.get(`/devices?userId=${clientId}`) // Busca apenas veículos deste usuário
      ]);

      const foundClient = usersRes.data.find(u => u.id === parseInt(clientId));
      setClient(foundClient);
      setDevices(devicesRes.data);

    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!client) return <Typography variant="h6" sx={{color:'#fff', mt:4, textAlign:'center'}}>Cliente não encontrado.</Typography>;

  // Estilos Glass
  const glassPaper = {
    background: 'rgba(30, 41, 59, 0.4)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden'
  };

  return (
    <Box>
      {/* --- HEADER DE NAVEGAÇÃO E INFO RÁPIDA --- */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate('/filial/clientes')} sx={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
            {client.name}
            <Chip 
              label={client.disabled ? "Bloqueado" : "Ativo"} 
              color={client.disabled ? "error" : "success"} 
              variant="outlined" 
              size="small"
            />
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>{client.email} • ID: {client.id}</Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />

        {/* KPI Rápido do Cliente */}
        <Paper sx={{ ...glassPaper, p: 1.5, display: 'flex', gap: 3, minWidth: 200, justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#00e5ff', lineHeight: 1 }}>{devices.length}</Typography>
                <Typography variant="caption" sx={{ color: '#aaa' }}>Veículos</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#00e676', lineHeight: 1 }}>
                    {devices.filter(d => d.status === 'online').length}
                </Typography>
                <Typography variant="caption" sx={{ color: '#aaa' }}>Online</Typography>
            </Box>
        </Paper>
      </Box>

      {/* --- ÁREA DE CONTEÚDO COM ABAS --- */}
      <Paper sx={{ ...glassPaper, minHeight: '60vh' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', px: 2 }}>
          <Tabs 
            value={tabIndex} 
            onChange={(e, v) => setTabIndex(v)} 
            textColor="primary" 
            indicatorColor="primary"
            sx={{ '& .MuiTab-root': { color: '#aaa', '&.Mui-selected': { color: '#00e5ff' } } }}
          >
            <Tab icon={<DirectionsCarIcon />} iconPosition="start" label="Gestão de Frota" />
            <Tab icon={<PersonIcon />} iconPosition="start" label="Dados Cadastrais" />
            <Tab icon={<SettingsIcon />} iconPosition="start" label="Configurações" />
          </Tabs>
        </Box>

        {/* ABA 0: VEÍCULOS */}
        {tabIndex === 0 && (
          <Box sx={{ p: 0 }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                {/* Botão inteligente que já abre o modal "pensando" neste cliente */}
                <Button 
                    variant="contained" 
                    startIcon={<DirectionsCarIcon />}
                    onClick={() => setIsVeiculoModalOpen(true)}
                    sx={{ borderRadius: 4, background: 'linear-gradient(45deg, #00e5ff, #00b0ff)' }}
                >
                    Adicionar Veículo a este Cliente
                </Button>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            
            {/* Reutilizamos o Grid Profissional */}
            <Box sx={{ height: 500 }}> 
               <DeviceDataGrid devices={devices} onDeviceSelect={() => {}} />
            </Box>
          </Box>
        )}

        {/* ABA 1: DADOS (Exemplo de formulário Read-only ou Editável) */}
        {tabIndex === 1 && (
          <Box sx={{ p: 4 }}>
            <Grid container spacing={3}>
               <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#aaa' }}>Nome Completo</Typography>
                  <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>{client.name}</Typography>
               </Grid>
               <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#aaa' }}>Email de Acesso</Typography>
                  <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>{client.email}</Typography>
               </Grid>
               <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#aaa' }}>Limite de Dispositivos</Typography>
                  <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>{client.deviceLimit === -1 ? 'Ilimitado' : client.deviceLimit}</Typography>
               </Grid>
               <Grid item xs={12}>
                  <Button variant="outlined" startIcon={<SaveIcon />} disabled>
                      Salvar Alterações (Em breve)
                  </Button>
               </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Modal de Veículo pré-configurado para este cliente */}
      {/* Nota: Precisaríamos adaptar o CreateVeiculoModal para aceitar um 'preSelectedClient' 
          ou você pode selecionar manualmente por enquanto na lista */}
      <CreateVeiculoModal 
        open={isVeiculoModalOpen} 
        onClose={() => setIsVeiculoModalOpen(false)} 
        onSuccess={() => { setIsVeiculoModalOpen(false); fetchData(); }}
      />
    </Box>
  );
};

export default ClientDetailPage;