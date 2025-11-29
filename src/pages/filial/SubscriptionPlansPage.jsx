import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, CardActions, Button, 
  List, ListItem, ListItemIcon, ListItemText, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';

const PlanCard = ({ plan, onEdit, onDelete }) => (
  <Card sx={{ 
    height: '100%', display: 'flex', flexDirection: 'column', 
    bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', 
    border: plan.recommended ? '2px solid #00e5ff' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: 4, position: 'relative'
  }}>
    {plan.recommended && (
      <Chip 
        label="Mais Vendido" 
        color="primary" 
        size="small" 
        icon={<StarIcon fontSize="small" />} 
        sx={{ position: 'absolute', top: 12, right: 12 }} 
      />
    )}
    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
      <Typography variant="h5" fontWeight="bold" color="#fff" gutterBottom>{plan.name}</Typography>
      <Typography variant="h3" color="primary.main" fontWeight="bold" sx={{ my: 2 }}>
        <Typography component="span" variant="h5" sx={{ verticalAlign: 'top', mr: 0.5 }}>R$</Typography>
        {plan.price}
        <Typography component="span" variant="body1" color="text.secondary">/mês</Typography>
      </Typography>
      <List dense>
        {plan.features.map((feature, idx) => (
          <ListItem key={idx} sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 32, color: '#00e676' }}><CheckCircleIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary={feature} primaryTypographyProps={{ color: '#ddd', fontSize: '0.9rem' }} />
          </ListItem>
        ))}
      </List>
    </CardContent>
    <CardActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)', justifyContent: 'space-between' }}>
      <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(plan)} sx={{ color: '#fff' }}>Editar</Button>
      <IconButton size="small" color="error" onClick={() => onDelete(plan.id)}><DeleteIcon /></IconButton>
    </CardActions>
  </Card>
);

const SubscriptionPlansPage = () => {
  const [plans, setPlans] = useState([
    { id: 1, name: 'Básico', price: '49,90', features: ['Rastreamento 24h', 'Histórico de 30 dias', 'Bloqueio Remoto'], recommended: false },
    { id: 2, name: 'Pro', price: '79,90', features: ['Tudo do Básico', 'Relatórios Avançados', 'Gestão de Manutenção', 'Alertas WhatsApp'], recommended: true },
    { id: 3, name: 'Enterprise', price: '129,90', features: ['Tudo do Pro', 'API Aberta', 'Gestor de Conta', 'Dashboards Customizados'], recommended: false },
  ]);
  const [open, setOpen] = useState(false);
  // Simplificado para o exemplo
  const [formData, setFormData] = useState({ name: '', price: '', features: '' });

  const handleSave = () => {
    const newPlan = { 
      id: Date.now(), 
      ...formData, 
      features: formData.features.split(',').map(f => f.trim()),
      recommended: false 
    };
    setPlans([...plans, newPlan]);
    setOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>Planos Comerciais</Typography>
          <Typography variant="body2" color="text.secondary">Defina os pacotes disponíveis para seus clientes</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Novo Plano</Button>
      </Box>

      <Grid container spacing={3}>
        {plans.map(plan => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <PlanCard plan={plan} onEdit={() => {}} onDelete={(id) => setPlans(plans.filter(p => p.id !== id))} />
          </Grid>
        ))}
      </Grid>

      {/* Modal Simples */}
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: '#1e293b', color: '#fff' } }}>
        <DialogTitle>Criar Novo Plano</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 300 }}>
            <TextField label="Nome do Plano" fullWidth value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} sx={{ '& input': { color: '#fff' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
            <TextField label="Preço (R$)" fullWidth value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} sx={{ '& input': { color: '#fff' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
            <TextField label="Funcionalidades (separar por vírgula)" fullWidth multiline rows={3} value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} sx={{ '& textarea': { color: '#fff' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionPlansPage;