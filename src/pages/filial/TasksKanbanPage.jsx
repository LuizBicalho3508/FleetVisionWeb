import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Card, CardContent, Chip, IconButton, Button, 
  Dialog, DialogTitle, DialogContent, TextField, DialogActions 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion } from 'framer-motion';

const columns = [
  { id: 'todo', title: 'A Fazer', color: '#ff9100' },
  { id: 'in_progress', title: 'Em Andamento', color: '#00e5ff' },
  { id: 'done', title: 'Concluído', color: '#00e676' },
];

const initialTasks = [
  { id: 1, title: 'Instalar Rastreador', vehicle: 'Ford Ka - BRA-2023', status: 'todo', date: 'Hoje' },
  { id: 2, title: 'Verificar Falha GPS', vehicle: 'Caminhão Volvo', status: 'in_progress', date: 'Ontem' },
  { id: 3, title: 'Configurar Alerta', vehicle: 'Frota Comercial', status: 'done', date: '20/10' },
];

const TasksKanbanPage = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', vehicle: '' });

  const moveTask = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleCreate = () => {
    const task = { 
        id: Date.now(), 
        title: newTask.title, 
        vehicle: newTask.vehicle, 
        status: 'todo', 
        date: 'Agora' 
    };
    setTasks([...tasks, task]);
    setOpen(false);
    setNewTask({ title: '', vehicle: '' });
  };

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>Ordens de Serviço</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Nova Tarefa</Button>
      </Box>

      <Grid container spacing={2} sx={{ flexGrow: 1, overflowX: 'auto', flexWrap: 'nowrap' }}>
        {columns.map(col => (
          <Grid item xs={12} md={4} key={col.id} sx={{ minWidth: 300, height: '100%' }}>
            <Paper sx={{ 
              height: '100%', p: 2, 
              bgcolor: 'rgba(30, 41, 59, 0.4)', borderRadius: 3, 
              borderTop: `4px solid ${col.color}`,
              display: 'flex', flexDirection: 'column'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="#fff">{col.title}</Typography>
                <Chip label={tasks.filter(t => t.status === col.id).length} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
              </Box>

              <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                {tasks.filter(t => t.status === col.id).map(task => (
                  <Card 
                    key={task.id} 
                    component={motion.div} layout
                    sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)', color: '#fff', position: 'relative' }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { p: 2 } }}>
                      <Typography variant="subtitle2" fontWeight="bold">{task.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{task.vehicle}</Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Chip icon={<AccessTimeIcon sx={{fontSize:14}}/>} label={task.date} size="small" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.1)', color: '#aaa', height: 24 }} />
                        
                        {/* Botões de Movimento Rápidos */}
                        <Box>
                            {col.id !== 'todo' && (
                                <IconButton size="small" onClick={() => moveTask(task.id, columns[columns.findIndex(c => c.id === col.id) - 1].id)} sx={{ color: '#aaa' }}>
                                    {'<'}
                                </IconButton>
                            )}
                            {col.id !== 'done' && (
                                <IconButton size="small" onClick={() => moveTask(task.id, columns[columns.findIndex(c => c.id === col.id) + 1].id)} sx={{ color: '#fff' }}>
                                    {'>'}
                                </IconButton>
                            )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Nova Tarefa</DialogTitle>
        <DialogContent>
            <Box sx={{ mt: 1, display:'flex', flexDirection:'column', gap: 2 }}>
                <TextField label="Título" fullWidth autoFocus value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                <TextField label="Veículo / Alvo" fullWidth value={newTask.vehicle} onChange={e => setNewTask({...newTask, vehicle: e.target.value})} />
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleCreate}>Criar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TasksKanbanPage;