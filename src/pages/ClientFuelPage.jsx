import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Box, Typography, Grid, Paper, Button, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, MenuItem, InputAdornment, IconButton, Tooltip 
} from '@mui/material';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RichTable from '../components/common/RichTable'; // Reutilizando sua tabela poderosa
import StatCard from '../components/dashboard/StatCard';
import dayjs from 'dayjs';

const ClientFuelPage = () => {
  const { liveDevices } = useOutletContext();
  const [entries, setEntries] = useState([
    { id: 1, vehicleId: 1, date: '2024-10-20', liters: 50, cost: 280, odometer: 15000, type: 'Gasolina' },
    { id: 2, vehicleId: 2, date: '2024-10-22', liters: 40, cost: 220, odometer: 22000, type: 'Etanol' },
  ]); // Mock inicial
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ vehicleId: '', date: dayjs().format('YYYY-MM-DD'), liters: '', cost: '', odometer: '', type: 'Diesel' });

  // Cálculos Rápidos
  const totalCost = entries.reduce((acc, curr) => acc + Number(curr.cost), 0);
  const totalLiters = entries.reduce((acc, curr) => acc + Number(curr.liters), 0);
  const avgPrice = totalLiters > 0 ? (totalCost / totalLiters).toFixed(2) : '0.00';

  const handleSave = () => {
    const newEntry = { ...formData, id: Date.now() };
    setEntries([newEntry, ...entries]);
    setOpen(false);
    setFormData({ vehicleId: '', date: dayjs().format('YYYY-MM-DD'), liters: '', cost: '', odometer: '', type: 'Diesel' });
  };

  const handleDelete = (ids) => {
    const idsToDelete = Array.isArray(ids) ? ids : [ids];
    setEntries(entries.filter(e => !idsToDelete.includes(e.id)));
  };

  const columns = [
    { id: 'date', label: 'Data', render: (row) => dayjs(row.date).format('DD/MM/YYYY') },
    { id: 'vehicleId', label: 'Veículo', render: (row) => liveDevices.find(d => d.id === row.vehicleId)?.name || 'Desconhecido' },
    { id: 'type', label: 'Tipo' },
    { id: 'liters', label: 'Litros', numeric: true, render: (row) => `${row.liters} L` },
    { id: 'cost', label: 'Custo Total', numeric: true, render: (row) => `R$ ${row.cost}` },
    { id: 'odometer', label: 'Odômetro', numeric: true, render: (row) => `${row.odometer} km` },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>Gestão de Combustível</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ bgcolor: '#ff9100', '&:hover': { bgcolor: '#ffa726' } }}>
          Novo Abastecimento
        </Button>
      </Box>

      {/* KPIs de Combustível */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Gasto Total (Mês)" value={`R$ ${totalCost}`} icon={<LocalGasStationIcon />} color="#ff9100" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Total Litros" value={`${totalLiters} L`} icon={<LocalGasStationIcon />} color="#00e5ff" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Preço Médio/L" value={`R$ ${avgPrice}`} icon={<LocalGasStationIcon />} color="#00e676" />
        </Grid>
      </Grid>

      <RichTable 
        title="Histórico de Abastecimentos"
        data={entries}
        columns={columns}
        selectable={true}
        onBulkDelete={handleDelete}
        actions={(row) => (
          <Tooltip title="Excluir">
            <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      />

      {/* Modal de Cadastro */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#1e293b', color: '#fff' } }}>
        <DialogTitle>Registrar Abastecimento</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField 
                select label="Veículo" fullWidth value={formData.vehicleId} 
                onChange={e => setFormData({...formData, vehicleId: e.target.value})}
                sx={{ '& .MuiInputBase-root': { color: '#fff' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
              >
                {liveDevices.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField label="Data" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} sx={{ '& input': { color: '#fff' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
            </Grid>
            <Grid item xs={6}>
              <TextField select label="Tipo" fullWidth value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} sx={{ '& .MuiInputBase-root': { color: '#fff' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}>
                {['Diesel', 'Gasolina', 'Etanol', 'GNV'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField label="Litros" type="number" fullWidth value={formData.liters} onChange={e => setFormData({...formData, liters: e.target.value})} sx={{ '& input': { color: '#fff' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Custo Total" type="number" fullWidth InputProps={{ startAdornment: <InputAdornment position="start" sx={{'& p':{color:'#aaa'}}}>R$</InputAdornment> }} value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} sx={{ '& input': { color: '#fff' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
            </Grid>
            <Grid item xs={4}>
              <TextField label="Odômetro (km)" type="number" fullWidth value={formData.odometer} onChange={e => setFormData({...formData, odometer: e.target.value})} sx={{ '& input': { color: '#fff' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#ff9100' }}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientFuelPage;