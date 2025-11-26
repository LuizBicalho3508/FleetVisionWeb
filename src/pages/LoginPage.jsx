import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // useSearchParams novo
import { 
  Container, Box, TextField, Button, Typography, CircularProgress, Alert, Paper, Avatar 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import apiClient, { adminApiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [systemLogo, setSystemLogo] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Lê a URL

  useEffect(() => {
    // Verifica se tem ID na URL (ex: ?id=5)
    const filialId = searchParams.get('id') || 'global';

    adminApiClient.get(`/branding/${filialId}`)
      .then(res => {
         if(res.data.logo) setSystemLogo(`https://fleetvision.com.br${res.data.logo}`);
         
         // Atualiza favicon também
         if(res.data.favicon) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = `https://fleetvision.com.br${res.data.favicon}`;
         }
      })
      .catch(err => console.log("Usando padrão"));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/session', new URLSearchParams({
        email: credentials.email,
        password: credentials.password,
      }));

      const user = response.data;
      const authToken = 'Basic ' + btoa(`${credentials.email}:${credentials.password}`);
      localStorage.setItem('traccar_auth_token', authToken);

      login(user);

      if (user.administrator) navigate('/admin/dashboard');
      else if (user.attributes?.role === 'filial') navigate('/filial/dashboard');
      else navigate('/dashboard');

    } catch (err) {
      console.error(err);
      setError('Acesso negado. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={24} sx={{ 
            p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4
        }}>
          
          {systemLogo ? (
            <img src={systemLogo} alt="Logo" style={{ maxHeight: '80px', maxWidth: '200px', objectFit:'contain', marginBottom: '20px' }} />
          ) : (
            <>
              <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                <LockOutlinedIcon sx={{ fontSize: 30, color: '#000' }} />
              </Avatar>
              <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 'bold', letterSpacing: 1, color: '#fff' }}>
                VISION FLEET
              </Typography>
            </>
          )}
          
          <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>Acesse sua conta</Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal" required fullWidth label="Email" name="email" autoComplete="email" autoFocus
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, '& label': { color: '#aaa' } }}
            />
            <TextField
              margin="normal" required fullWidth label="Senha" name="password" type="password"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              sx={{ '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, '& label': { color: '#aaa' } }}
            />
            
            {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }}>{error}</Alert>}
            
            <Button 
              type="submit" fullWidth variant="contained" size="large" 
              sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1rem', borderRadius: 1 }} 
              disabled={loading}
            >
              {loading ? <CircularProgress size={26} color="inherit" /> : 'ENTRAR'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;