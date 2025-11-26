import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Grid, Avatar, CircularProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { adminApiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const BrandingPage = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const getImgUrl = (path) => path ? `https://fleetvision.com.br${path}` : '';
  const [logoPreview, setLogoPreview] = useState(getImgUrl(user?.attributes?.logo));
  const [faviconPreview, setFaviconPreview] = useState(getImgUrl(user?.attributes?.favicon));

  const handleUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);
    formData.append('type', type);

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await adminApiClient.post('/branding', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newUrl = `https://fleetvision.com.br${response.data.url}`;
      
      if (type === 'logo') setLogoPreview(newUrl);
      else setFaviconPreview(newUrl);

      // ATUALIZAÇÃO CRÍTICA: Atualiza o objeto do usuário no navegador
      // Isso faz o Header/Sidebar atualizar a imagem imediatamente
      const updatedUser = { 
          ...user, 
          attributes: { ...user.attributes, [type]: response.data.url } 
      };
      login(updatedUser); 

      setMessage({ text: 'Imagem enviada e aplicada!', type: 'success' });
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Erro ao salvar imagem. Tente uma menor ou formato PNG.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ color: '#fff', mb: 4, fontWeight: 'bold' }}>Personalização Visual</Typography>

      {message.text && <Alert severity={message.type} sx={{ mb: 3 }}>{message.text}</Alert>}

      <Grid container spacing={4}>
        {/* LOGO */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, bgcolor: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(12px)', borderRadius: 4, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>Logo do Sistema</Typography>
            <Box sx={{ height: 100, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 2, bgcolor: 'rgba(0,0,0,0.2)' }}>
              {logoPreview ? <img src={logoPreview} alt="Logo" style={{ maxHeight: '80px', maxWidth: '90%' }} /> : <Typography sx={{ color: '#aaa' }}>Sem Logo</Typography>}
            </Box>
            <Button component="label" variant="contained" startIcon={loading ? <CircularProgress size={20}/> : <CloudUploadIcon />} disabled={loading}>
              Upload Logo
              <input type="file" hidden accept="image/*" onChange={(e) => handleUpload(e, 'logo')} />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1, color: '#aaa' }}>PNG Transparente (Max 5MB)</Typography>
          </Paper>
        </Grid>
        {/* FAVICON */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, bgcolor: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(12px)', borderRadius: 4, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>Ícone (Favicon)</Typography>
            <Box sx={{ height: 100, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 2, bgcolor: 'rgba(0,0,0,0.2)' }}>
              {faviconPreview ? <Avatar src={faviconPreview} sx={{ width: 48, height: 48 }} variant="square" /> : <Typography sx={{ color: '#aaa' }}>Sem Ícone</Typography>}
            </Box>
            <Button component="label" variant="contained" color="secondary" startIcon={loading ? <CircularProgress size={20}/> : <CloudUploadIcon />} disabled={loading}>
              Upload Favicon
              <input type="file" hidden accept="image/*" onChange={(e) => handleUpload(e, 'favicon')} />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1, color: '#aaa' }}>PNG ou ICO (Max 5MB)</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BrandingPage;