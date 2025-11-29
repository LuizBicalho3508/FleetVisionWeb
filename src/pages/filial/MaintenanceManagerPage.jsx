import React, { useState } from 'react';
import { 
  Box, Typography, Button, Grid, Paper, LinearProgress, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import dayjs from 'dayjs';

// Mock de dados (em produção viria da API)
const initialPlans = [
  { id: 1, vehicleName: 'Honda Civic - ABC-1234', service: 'Troca de Óleo', lastKm: 40000, nextKm: 50000, currentKm: 48500, intervalKm: 10000 },
  { id: 2, vehicleName: 'Fiat Toro - XYZ-9876', service: 'Revisão Freios', lastKm: 20000, nextKm: 30000, currentKm: 31000, intervalKm: 10000 },
  { id: 3, vehicleName: 'VW Gol - DEF-4567', service: 'Rodízio Pneus', lastKm: 15000, nextKm: 25000, currentKm: 18000, intervalKm: 10000 },
];

const MaintenanceCard = ({ plan }) => {
  // Lógica de Status
  const progress = Math.min(100, Math.max(0, ((plan.currentKm - plan.lastKm) / plan.intervalKm) * 100));
  const isExpired = plan.currentKm >= plan.nextKm;
  const isWarning = progress >= 80 && !isExpired;

  let statusColor = 'success';
  let StatusIcon = CheckCircleIcon;
  let statusText = 'Em dia';

  if (isWarning) { statusColor = 'warning'; StatusIcon = WarningIcon; statusText = 'Próximo'; }
  if (isExpired) { statusColor = 'error'; StatusIcon = ErrorIcon; statusText = 'Vencido'; }

  return (
    <Paper sx={{ p: 2, position: 'relative', overflow: 'hidden', borderRadius: 3, borderLeft: `6px solid`, borderColor: `${statusColor}.main` }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">{plan.service}</Typography>
          <Typography variant="body2" color="text.secondary">{plan.vehicleName}</Typography>
        </Box>
        <Chip label={statusText} color={statusColor} size="small" icon={<StatusIcon />} />
      </Box>

      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption">Progresso</Typography>
          <Typography variant="caption" fontWeight="bold">{progress.toFixed(0)}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} color={statusColor} sx={{ height: 8, borderRadius: 4 }} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, bgcolor: 'rgba(255,255,255,0.05)', p: 1, borderRadius: 1 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">Atual</Typography>
          <Typography variant="body2" fontWeight="bold">{plan.currentKm} km</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary" display="block">Próxima</Typography>
          <Typography variant="body2" fontWeight="bold" color={isExpired ? 'error.main' : 'text.primary'}>
            {plan.nextKm} km
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
         {/* Botão de ação rápida (ex: Registrar Execução) */}
      </Box>
    </Paper>
  );
};

const MaintenanceManagerPage = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [open, setOpen] = useState(false);
  
  // Form simplificado
  const [formData, setFormData] = useState({ vehicle: '', service: '', interval: '' });

  const handleSave = () => {
    // Simulação de salvamento
    const newPlan = {
      id: Date.now(),
      vehicleName: 'Novo Veículo - TST-0000', // Mock
      service: formData.service,
      lastKm: 0,
      nextKm: parseInt(formData.interval),
      currentKm: 0,
      intervalKm: parseInt(formData.interval)
    };
    setPlans([...plans, newPlan]);
    setOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>Planos de Manutenção</Typography>
          <Typography variant="body2" color="text.secondary">Alertas preventivos baseados em quilometragem</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Criar Plano</Button>
      </Box>

      <Grid container spacing={3}>
        {plans.map(plan => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <MaintenanceCard plan={plan} />
          </Grid>
        ))}
      </Grid>

      {/* Modal de Criação */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Novo Plano Preventivo</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Veículo" select fullWidth defaultValue="" onChange={e => setFormData({...formData, vehicle: e.target.value})}>
                <MenuItem value="1">Honda Civic - ABC-1234</MenuItem>
                <MenuItem value="2">Fiat Toro - XYZ-9876</MenuItem>
            </TextField>
            <TextField label="Serviço (ex: Troca de Óleo)" fullWidth onChange={e => setFormData({...formData, service: e.target.value})} />
            <TextField label="Intervalo (km)" type="number" fullWidth onChange={e => setFormData({...formData, interval: e.target.value})} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaintenanceManagerPage;