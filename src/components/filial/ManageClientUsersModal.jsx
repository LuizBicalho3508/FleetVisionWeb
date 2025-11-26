import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, 
  List, ListItem, ListItemText, IconButton, Typography, Alert, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { adminApiClient } from '../../api/apiClient';

const ManageClientUsersModal = ({ open, onClose, client, filialId }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!client) return;
    try {
      const response = await adminApiClient.get('/users');
      // Filtra usuários que pertencem a este cliente (usando a lógica de parentId)
      const subUsers = response.data.filter(u => u.attributes?.parentId === client.id);
      setUsers(subUsers);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  }, [client]);

  useEffect(() => {
    if (open) fetchUsers();
  }, [open, fetchUsers]);

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) return;
    setLoading(true);
    try {
      const userData = {
        ...newUser,
        deviceLimit: -1,
        attributes: {
          role: 'subuser',
          parentId: client.id,
          filialId: filialId
        }
      };
      
      const res = await adminApiClient.post('/users', userData);
      const newUserId = res.data.id;

      // Permissão para a Filial
      await adminApiClient.post('/permissions', { userId: filialId, managedUserId: newUserId });

      setNewUser({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      setError('Erro ao criar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if(!window.confirm("Excluir usuário?")) return;
    try {
      await adminApiClient.delete(`/users/${userId}`);
      fetchUsers();
    } catch(err) {
      console.error(err);
    }
  };

  const glassPaper = {
    style: { 
      backgroundColor: 'rgba(30, 41, 59, 0.95)', 
      backdropFilter: 'blur(20px)', 
      border: '1px solid rgba(255,255,255,0.1)', 
      color: '#fff', borderRadius: 4 
    }
  };

  const inputStyle = { 
    sx: { 
      '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, 
      '& label': { color: '#aaa' } 
    } 
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={glassPaper}>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        Usuários de {client?.name}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: '#aaa' }}>ADICIONAR ACESSO SECUNDÁRIO</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 3 }}>
            <TextField label="Nome" size="small" fullWidth value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} {...inputStyle} />
            <TextField label="Email" size="small" fullWidth value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} {...inputStyle} />
            <TextField label="Senha" type="password" size="small" fullWidth value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} {...inputStyle} />
            <Button variant="contained" onClick={handleCreateUser} disabled={loading} sx={{borderRadius: 1}}><AddIcon /></Button>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

          <List>
            {users.length === 0 && <Typography sx={{color:'#aaa', textAlign:'center'}}>Nenhum usuário extra.</Typography>}
            {users.map(u => (
              <ListItem key={u.id} secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(u.id)} sx={{ color: '#ff1744' }}>
                  <DeleteIcon />
                </IconButton>
              } sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <ListItemText primary={u.name} secondary={u.email} primaryTypographyProps={{ color: '#fff' }} secondaryTypographyProps={{ color: '#aaa' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#fff' }}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageClientUsersModal;