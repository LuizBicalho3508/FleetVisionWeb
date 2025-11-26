import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Avatar, CircularProgress, Tooltip, Chip 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EditIcon from '@mui/icons-material/Edit';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import CreateClienteModal from '../../components/filial/CreateClienteModal';
import ManageClientUsersModal from '../../components/filial/ManageClientUsersModal'; // <--- IMPORTANTE
import EditClienteModal from '../../components/filial/EditClienteModal'; // <--- IMPORTANTE
import dayjs from 'dayjs';

const ClientesPage = () => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientForUsers, setSelectedClientForUsers] = useState(null);
  const [editingClient, setEditingClient] = useState(null); // <--- Estado para edição

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/users');
      const filtered = response.data.filter(u => u.id !== user.id && !u.administrator);
      setClientes(filtered);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    fetchClientes(); 
  };

  const checkContractStatus = (end) => {
    if (!end) return { label: 'Indefinido', color: 'default' };
    const days = dayjs(end).diff(dayjs(), 'day');
    if (days < 0) return { label: 'Vencido', color: 'error' };
    if (days < 30) return { label: 'Vence em breve', color: 'warning' };
    return { label: 'Vigente', color: 'success' };
  };

  const cellStyle = { color: '#e0e0e0', borderBottom: '1px solid rgba(255,255,255,0.1)' };
  const headerStyle = { fontWeight: 'bold', color: '#00e5ff', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)' };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>Meus Clientes</Typography>
        <Button 
          variant="contained" startIcon={<PersonAddIcon />} onClick={() => setIsModalOpen(true)}
          sx={{ borderRadius: 1, background: 'linear-gradient(45deg, #7c4dff, #00e5ff)', fontWeight: 'bold' }}
        >
          Novo Cliente
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
        {loading ? <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerStyle}>Cliente</TableCell>
                <TableCell sx={headerStyle}>Contrato</TableCell>
                <TableCell sx={headerStyle} align="center">Status</TableCell>
                <TableCell sx={headerStyle} align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente) => {
                const end = cliente.attributes?.contractEnd;
                const status = checkContractStatus(end);
                return (
                  <TableRow key={cliente.id} hover sx={{ '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
                    <TableCell sx={cellStyle}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#7c4dff', width: 32, height: 32, fontSize: 14 }}>{cliente.name.charAt(0)}</Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight="bold">{cliente.name}</Typography>
                            <Typography variant="caption" sx={{opacity:0.7}}>{cliente.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={cellStyle}>{end ? dayjs(end).format('DD/MM/YYYY') : '-'}</TableCell>
                    <TableCell sx={cellStyle} align="center">
                       <Chip label={status.label} color={status.color} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell sx={cellStyle} align="right">
                      <Tooltip title="Gerenciar Usuários">
                        <IconButton sx={{ color: '#ffb74d' }} onClick={() => setSelectedClientForUsers(cliente)}>
                          <GroupAddIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Veículos">
                        <IconButton component={RouterLink} to={`/filial/clientes/${cliente.id}`} sx={{ color: '#00e5ff' }}>
                          <DirectionsCarIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton size="small" sx={{ color: '#fff' }} onClick={() => setEditingClient(cliente)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {user && <CreateClienteModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleModalSuccess} filialId={user.id} />}
      
      {selectedClientForUsers && (
        <ManageClientUsersModal open={!!selectedClientForUsers} client={selectedClientForUsers} filialId={user.id} onClose={() => setSelectedClientForUsers(null)} />
      )}

      {editingClient && (
        <EditClienteModal open={!!editingClient} cliente={editingClient} onClose={() => setEditingClient(null)} onSuccess={handleModalSuccess} />
      )}
    </Box>
  );
};

export default ClientesPage;