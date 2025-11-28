import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, Button, Grid, IconButton, InputBase, ToggleButton, ToggleButtonGroup, 
  CircularProgress, Alert, Avatar, Tooltip, Chip
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// Componentes e Hooks
import { useVehicles, useUsers, useDeleteVehicle } from '../../hooks/useFleetData';
import VehicleCard from '../../components/vehicles/VehicleCard';
import RichTable from '../../components/common/RichTable';
import CreateVeiculoModal from '../../components/filial/CreateVeiculoModal';
import EditVehicleModal from '../../components/EditVehicleModal';
import PermissionGate from '../../components/common/PermissionGate';
import { PERMISSIONS } from '../../config/roles';

// Estilos de Busca
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.10) },
  width: '100%',
  maxWidth: 400,
  border: '1px solid rgba(255,255,255,0.1)',
  marginRight: theme.spacing(2),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2), height: '100%', position: 'absolute',
  pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit', width: '100%',
  '& .MuiInputBase-input': { padding: theme.spacing(1, 1, 1, 0), paddingLeft: `calc(1em + ${theme.spacing(4)})` },
}));

const VeiculosPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // React Query Hooks
  const { data: veiculos = [], isLoading, isError } = useVehicles();
  const { data: users = [] } = useUsers();
  const deleteMutation = useDeleteVehicle();

  // Mapa de Proprietários
  const userMap = useMemo(() => {
    const map = {};
    users.forEach(u => map[u.id] = u.name);
    return map;
  }, [users]);

  // Filtragem
  const filteredVehicles = useMemo(() => {
    return veiculos.filter(v => 
      v.name.toLowerCase().includes(search.toLowerCase()) || 
      v.uniqueId.includes(search)
    );
  }, [veiculos, search]);

  // Colunas da Tabela
  const columns = [
    { id: 'name', label: 'Veículo', render: (row) => (
      <Box sx={{display:'flex', alignItems:'center', gap: 2}}>
        <Avatar sx={{bgcolor:'primary.main', width:30, height:30}}><DirectionsCarIcon fontSize="small"/></Avatar>
        <Box>
          <Typography variant="body2" fontWeight="bold">{row.name}</Typography>
          <Typography variant="caption" sx={{opacity:0.7}}>{row.attributes?.modelo}</Typography>
        </Box>
      </Box>
    )},
    { id: 'uniqueId', label: 'IMEI' },
    { id: 'ownerId', label: 'Proprietário', render: (row) => userMap[row.attributes?.ownerId] || '-' },
    { id: 'status', label: 'Status', render: (row) => (
      <Chip label={row.status === 'online' ? 'Online' : 'Offline'} color={row.status === 'online' ? 'success' : 'error'} size="small" variant="outlined"/>
    )}
  ];

  // Ações da Tabela com Proteção
  const tableActions = (row) => (
    <Box>
      <PermissionGate permissions={PERMISSIONS.EDIT_VEHICLES}>
        <Tooltip title="Editar">
          <IconButton size="small" color="primary" onClick={(e) => { e.stopPropagation(); setEditingVehicle(row); }}>
            <EditIcon fontSize="small"/>
          </IconButton>
        </Tooltip>
      </PermissionGate>
      
      <PermissionGate permissions={PERMISSIONS.DELETE_VEHICLES}>
        <Tooltip title="Excluir">
          <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}>
            <DeleteIcon fontSize="small"/>
          </IconButton>
        </Tooltip>
      </PermissionGate>
    </Box>
  );

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Box sx={{display:'flex', justifyContent:'center', p:5}}><CircularProgress /></Box>;
  if (isError) return <Alert severity="error">Erro ao carregar veículos.</Alert>;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Frota</Typography>
          <Typography variant="body2" color="text.secondary">Gerencie todos os veículos ativos</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', md: 'auto' } }}>
          <Search>
            <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
            <StyledInputBase placeholder="Buscar placa ou IMEI..." onChange={(e) => setSearch(e.target.value)} value={search} />
          </Search>

          <ToggleButtonGroup 
            value={viewMode} 
            exclusive 
            onChange={(e, next) => next && setViewMode(next)} 
            size="small"
            sx={{ borderColor: 'divider' }}
          >
            <ToggleButton value="grid" sx={{color:'text.primary'}}><ViewModuleIcon /></ToggleButton>
            <ToggleButton value="list" sx={{color:'text.primary'}}><ViewListIcon /></ToggleButton>
          </ToggleButtonGroup>

          <PermissionGate permissions={PERMISSIONS.CREATE_VEHICLES}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateOpen(true)}>
              Novo
            </Button>
          </PermissionGate>
        </Box>
      </Box>

      {/* Conteúdo */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredVehicles.map(vehicle => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={vehicle.id}>
              <VehicleCard 
                vehicle={vehicle} 
                onEdit={setEditingVehicle} 
                onDelete={handleDelete}
                ownerName={userMap[vehicle.attributes?.ownerId]}
              />
            </Grid>
          ))}
          {filteredVehicles.length === 0 && (
            <Grid item xs={12}><Typography align="center" sx={{color:'text.secondary', mt:4}}>Nenhum veículo encontrado.</Typography></Grid>
          )}
        </Grid>
      ) : (
        <RichTable 
          data={filteredVehicles}
          columns={columns}
          actions={tableActions}
          selectable
        />
      )}

      {/* Modais */}
      <CreateVeiculoModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={() => setIsCreateOpen(false)} />
      {editingVehicle && <EditVehicleModal open={!!editingVehicle} vehicle={editingVehicle} onClose={() => setEditingVehicle(null)} onSuccess={() => setEditingVehicle(null)} />}
    </Box>
  );
};

export default VeiculosPage;