import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, Button, CircularProgress, Alert, Avatar, Tooltip, Chip, IconButton 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import { useVehicles, useUsers, useDeleteVehicle } from '../../hooks/useFleetData';
import RichTable from '../../components/common/RichTable'; // <--- O componente poderoso
import CreateVeiculoModal from '../../components/filial/CreateVeiculoModal';
import EditVehicleModal from '../../components/EditVehicleModal';

const VeiculosPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const { data: veiculos = [], isLoading, isError } = useVehicles();
  const { data: users = [] } = useUsers();
  const deleteMutation = useDeleteVehicle();

  const userMap = useMemo(() => {
    const map = {};
    users.forEach(u => map[u.id] = u.name);
    return map;
  }, [users]);

  const handleDelete = (ids) => {
    // Suporta deleção única ou em massa (array)
    const idsToDelete = Array.isArray(ids) ? ids : [ids];
    if (window.confirm(`Excluir ${idsToDelete.length} veículo(s)?`)) {
        idsToDelete.forEach(id => deleteMutation.mutate(id));
    }
  };

  const columns = [
    { id: 'name', label: 'Veículo', render: (row) => (
      <Box sx={{display:'flex', alignItems:'center', gap: 2}}>
        <Avatar sx={{bgcolor:'primary.main', width:30, height:30}}><DirectionsCarIcon fontSize="small"/></Avatar>
        <Box>
          <Typography variant="body2" fontWeight="bold">{row.name}</Typography>
          <Typography variant="caption" sx={{opacity:0.7}}>{row.attributes?.modelo || 'Sem modelo'}</Typography>
        </Box>
      </Box>
    )},
    { id: 'uniqueId', label: 'IMEI' },
    { id: 'ownerId', label: 'Proprietário', render: (row) => userMap[row.attributes?.ownerId] || '-' },
    { id: 'status', label: 'Status', render: (row) => (
      <Chip label={row.status === 'online' ? 'Online' : 'Offline'} color={row.status === 'online' ? 'success' : 'error'} size="small" variant="outlined"/>
    )}
  ];

  const tableActions = (row) => (
    <Box>
      <Tooltip title="Editar">
        <IconButton size="small" color="primary" onClick={() => setEditingVehicle(row)}>
          <EditIcon fontSize="small"/>
        </IconButton>
      </Tooltip>
      <Tooltip title="Excluir">
        <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
          <DeleteIcon fontSize="small"/>
        </IconButton>
      </Tooltip>
    </Box>
  );

  if (isLoading) return <Box sx={{display:'flex', justifyContent:'center', p:5}}><CircularProgress /></Box>;
  if (isError) return <Alert severity="error">Erro ao carregar veículos.</Alert>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
            <Typography variant="h4" fontWeight="bold">Frota</Typography>
            <Typography variant="body2" color="text.secondary">Gerencie os veículos de seus clientes</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateOpen(true)}>
          Novo Veículo
        </Button>
      </Box>

      <RichTable 
        title="Lista de Veículos"
        data={veiculos}
        columns={columns}
        actions={tableActions}
        selectable={true}
        onBulkDelete={handleDelete}
      />

      <CreateVeiculoModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={() => setIsCreateOpen(false)} />
      {editingVehicle && <EditVehicleModal open={!!editingVehicle} vehicle={editingVehicle} onClose={() => setEditingVehicle(null)} onSuccess={() => setEditingVehicle(null)} />}
    </Box>
  );
};

export default VeiculosPage;