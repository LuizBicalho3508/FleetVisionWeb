import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, TextField, Button, Grid, Avatar, Divider, Alert, CircularProgress 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { user, login } = useAuth(); // login aqui serve para atualizar o contexto local
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Atualiza dados básicos
      const payload = {
        id: user.id,
        name: formData.name,
        phone: formData.phone,
        // Mantém atributos existentes para não perder (role, filialId, etc)
        attributes: { ...user.attributes }
      };

      const { data: updatedUser } = await apiClient.put(`/users/${user.id}`, payload);
      
      // Atualiza sessão local
      login({ ...user, ...updatedUser }); 
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('As senhas não conferem.');
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      // O Traccar permite admin/próprio usuário trocar senha enviando o campo password
      // Nota: Em sistemas reais, validaria a currentPassword no backend antes.
      const payload = {
        id: user.id,
        password: formData.newPassword
      };

      await apiClient.put(`/users/${user.id}`, payload);
      toast.success('Senha alterada com sucesso!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error) {
      console.error(error);
      toast.error('Erro ao alterar senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff', mb: 3 }}>
        Minha Conta
      </Typography>

      {/* Seção Perfil */}
      <Paper sx={{ p: 4, mb: 3, bgcolor: 'rgba(30,41,59,0.4)', backdropFilter: 'blur(10px)', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
            <AccountCircleIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" color="#fff">Dados Pessoais</Typography>
            <Typography variant="body2" color="text.secondary">Atualize suas informações de contato</Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth label="Nome Completo" name="name" 
              value={formData.name} onChange={handleChange} 
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth label="Telefone" name="phone" 
              value={formData.phone} onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth label="Email" value={formData.email} disabled 
              helperText="O email não pode ser alterado."
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" startIcon={<SaveIcon />} 
              onClick={handleSaveProfile} disabled={loading}
            >
              Salvar Alterações
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Seção Segurança */}
      <Paper sx={{ p: 4, bgcolor: 'rgba(30,41,59,0.4)', backdropFilter: 'blur(10px)', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <Avatar sx={{ width: 48, height: 48, bgcolor: 'error.main' }}>
            <LockIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" color="#fff">Segurança</Typography>
            <Typography variant="body2" color="text.secondary">Alteração de senha</Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField 
              fullWidth type="password" label="Nova Senha" name="newPassword" 
              value={formData.newPassword} onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth type="password" label="Confirmar Nova Senha" name="confirmPassword" 
              value={formData.confirmPassword} onChange={handleChange} 
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" color="error" startIcon={<SaveIcon />} 
              onClick={handleChangePassword} disabled={loading || !formData.newPassword}
            >
              Atualizar Senha
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SettingsPage;