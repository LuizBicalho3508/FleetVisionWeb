import React, { useState } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, 
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import dayjs from 'dayjs';
import { useMaintenances, useAddMaintenance } from '../../hooks/useFleetData';

const MaintenanceList = ({ deviceId }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ type: '', cost: '', date: dayjs().format('YYYY-MM-DD'), notes: '' });
  
  // Como o backend de manutenção pode não existir no seu Traccar padrão, 
  // vamos simular uma lista vazia ou usar o hook se tiver implementado.
  // Para este exemplo, usaremos dados locais mockados se a API falhar.
  const { data: maintenances = [], isLoading } = useMaintenances(deviceId);
  const addMutation = useAddMaintenance();

  // Mock de dados para visualização imediata se a API estiver vazia
  const displayData = maintenances.length > 0 ? maintenances : [
    { id: 1, type: 'Troca de Óleo', cost: 350, date: '2024-10-15', notes: 'Óleo 5W30 Sintético' },
    { id: 2, type: 'Alinhamento', cost: 120, date: '2024-09-01', notes: 'Preventiva' }
  ];

  const handleSave = () => {
    addMutation.mutate({ ...formData, deviceId });
    setOpen(false);
    // Em um cenário real, o React Query atualizaria a lista.
    // Aqui, apenas fechamos o modal.
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#fff' }}>Histórico de Manutenções</Typography>
        <Button startIcon={<AddIcon />} variant="contained" size="small" onClick={() => setOpen(true)}>
          Nova Manutenção
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Data</TableCell>
            <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Serviço</TableCell>
            <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Custo</TableCell>
            <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>Obs</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayData.map((row) => (
            <TableRow key={row.id}>
              <TableCell sx={{ color: '#ccc' }}>{dayjs(row.date).format('DD/MM/YYYY')}</TableCell>
              <TableCell>
                <Chip icon={<BuildIcon sx={{ fontSize: 14 }} />} label={row.type} size="small" sx={{ bgcolor: 'rgba(0, 229, 255, 0.1)', color: '#00e5ff' }} />
              </TableCell>
              <TableCell sx={{ color: '#00e676' }}>R$ {row.cost}</TableCell>
              <TableCell sx={{ color: '#aaa', fontSize: '0.8rem' }}>{row.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* MODAL DE CADASTRO */}
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: '#fff' } }}>
        <DialogTitle>Registrar Manutenção</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 300 }}>
            <TextField 
              select label="Tipo de Serviço" fullWidth 
              value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
              sx={{ '& .MuiInputBase-root': { color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
            >
              <MenuItem value="Troca de Óleo">Troca de Óleo</MenuItem>
              <MenuItem value="Pneus">Pneus</MenuItem>
              <MenuItem value="Freios">Freios</MenuItem>
              <MenuItem value="Revisão Geral">Revisão Geral</MenuItem>
            </TextField>
            <TextField 
              label="Custo (R$)" type="number" fullWidth 
              value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})}
              sx={{ '& input': { color: '#fff' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
            />
            <TextField 
              label="Data" type="date" fullWidth InputLabelProps={{ shrink: true }}
              value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
              sx={{ '& input': { color: '#fff' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
            />
            <TextField 
              label="Observações" fullWidth multiline rows={2}
              value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
              sx={{ '& textarea': { color: '#fff' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaintenanceList;