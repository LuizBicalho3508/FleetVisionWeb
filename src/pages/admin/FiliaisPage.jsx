import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, IconButton, Tooltip, Chip, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import { adminApiClient } from '../../api/apiClient';
import CreateFilialModal from '../../components/admin/CreateFilialModal';
import EditFilialModal from '../../components/admin/EditFilialModal';
import RichTable from '../../components/common/RichTable'; // <--- Importando o novo componente
import dayjs from 'dayjs';

const FiliaisPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingFilial, setEditingFilial] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, devicesRes] = await Promise.all([
        adminApiClient.get('/users'),
        adminApiClient.get('/devices')
      ]);

      const users = usersRes.data;
      const devices = devicesRes.data;
      const rawFiliais = users.filter(user => user.attributes?.role === 'filial');

      // Processa dados para a tabela
      const processed = rawFiliais.map(filial => {
        const filialClients = users.filter(u => u.attributes?.role === 'cliente' && String(u.attributes?.filialId) === String(filial.id));
        const clientIds = filialClients.map(c => String(c.id));
        const activeDevices = devices.filter(d => clientIds.includes(String(d.attributes?.ownerId)) && !d.disabled).length;
        
        return {
          ...filial,
          clientsCount: filialClients.length,
          devicesCount: activeDevices,
          contractStatus: filial.attributes?.contractEnd 
            ? (dayjs(filial.attributes.contractEnd).isBefore(dayjs()) ? 'Vencido' : 'Vigente')
            : 'Indefinido'
        };
      });

      setData(processed);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Definição das colunas da Tabela Pro
  const columns = [
    { id: 'name', label: 'Filial', render: (row) => (
      <Box sx={{display:'flex', alignItems:'center', gap: 2}}>
        <Avatar sx={{bgcolor: 'primary.main', width: 32, height: 32}}>{row.name.charAt(0)}</Avatar>
        <Box>
          <Box sx={{fontWeight:'bold'}}>{row.name}</Box>
          <Box sx={{fontSize:'0.75rem', opacity:0.7}}>{row.email}</Box>
        </Box>
      </Box>
    )},
    { id: 'clientsCount', label: 'Clientes', numeric: true, render: (row) => <Chip label={row.clientsCount} size="small" variant="outlined" /> },
    { id: 'devicesCount', label: 'Veículos Ativos', numeric: true, render: (row) => <Chip label={row.devicesCount} color="primary" size="small" /> },
    { id: 'contractStatus', label: 'Contrato', render: (row) => (
      <Chip label={row.contractStatus} color={row.contractStatus === 'Vencido' ? 'error' : 'success'} size="small" variant="outlined" />
    )},
    { id: 'disabled', label: 'Status', render: (row) => (
      <Chip label={row.disabled ? "Suspensa" : "Ativa"} color={row.disabled ? "default" : "success"} size="small" />
    )},
  ];

  // Renderização das Ações
  const renderActions = (row) => (
    <Box>
      <Tooltip title="Editar"><IconButton size="small" color="primary" onClick={() => setEditingFilial(row)}><EditIcon fontSize="small"/></IconButton></Tooltip>
      <Tooltip title="Suspender/Ativar"><IconButton size="small" color="warning"><BlockIcon fontSize="small"/></IconButton></Tooltip>
      <Tooltip title="Excluir"><IconButton size="small" color="error"><DeleteIcon fontSize="small"/></IconButton></Tooltip>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateModalOpen(true)}>Nova Filial</Button>
      </Box>

      <RichTable 
        title="Gestão de Filiais"
        data={data}
        columns={columns}
        actions={renderActions}
        selectable={true}
      />

      <CreateFilialModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={() => { setIsCreateModalOpen(false); fetchData(); }} />
      {editingFilial && <EditFilialModal open={!!editingFilial} filial={editingFilial} onClose={() => setEditingFilial(null)} onSuccess={() => { setEditingFilial(null); fetchData(); }} />}
    </Box>
  );
};

export default FiliaisPage;