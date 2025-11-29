import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Switch, Button, TextField, 
  InputAdornment, IconButton, Chip, Divider 
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WebhookIcon from '@mui/icons-material/Webhook';
import StorageIcon from '@mui/icons-material/Storage';
import TelegramIcon from '@mui/icons-material/Telegram'; // Simulando Slack/Telegram
import { toast } from 'sonner';

const IntegrationCard = ({ title, description, icon, active, onToggle, children }) => (
  <Paper sx={{ p: 3, height: '100%', bgcolor: 'rgba(30,41,59,0.4)', borderRadius: 3, border: active ? '1px solid #00e5ff' : '1px solid rgba(255,255,255,0.1)' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, color: active ? '#00e5ff' : '#aaa' }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" color="#fff">{title}</Typography>
          <Typography variant="caption" color="text.secondary">{description}</Typography>
        </Box>
      </Box>
      <Switch checked={active} onChange={onToggle} color="primary" />
    </Box>
    <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
    <Box sx={{ opacity: active ? 1 : 0.5, pointerEvents: active ? 'auto' : 'none' }}>
      {children}
    </Box>
  </Paper>
);

const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState({
    webhook: false,
    google: true,
    api: true
  });
  const [showKey, setShowKey] = useState(false);

  const toggle = (key) => setIntegrations(prev => ({ ...prev, [key]: !prev[key] }));

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="#fff">Integrações</Typography>
        <Typography variant="body2" color="text.secondary">Conecte o Fleet Vision às suas ferramentas favoritas</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* API ACCESS */}
        <Grid item xs={12} md={6}>
          <IntegrationCard 
            title="API Pública" 
            description="Acesso para desenvolvedores e sistemas externos" 
            icon={<StorageIcon />} 
            active={integrations.api}
            onToggle={() => toggle('api')}
          >
            <Typography variant="caption" color="#aaa" display="block" mb={1}>CHAVE DE API (MASTER)</Typography>
            <TextField 
              fullWidth size="small" 
              value="fv_live_89234789234..." 
              type={showKey ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowKey(!showKey)} sx={{ color: '#fff' }}>
                      {showKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                    <IconButton onClick={() => copyToClipboard('fv_live_89234789234...')} sx={{ color: '#00e5ff' }}>
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ '& input': { color: '#fff', fontFamily: 'monospace' } }}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" color="warning">Regerar Chave</Button>
                <Button size="small" variant="text">Ver Documentação</Button>
            </Box>
          </IntegrationCard>
        </Grid>

        {/* WEBHOOKS */}
        <Grid item xs={12} md={6}>
          <IntegrationCard 
            title="Webhooks" 
            description="Notificações de eventos em tempo real" 
            icon={<WebhookIcon />} 
            active={integrations.webhook}
            onToggle={() => toggle('webhook')}
          >
            <TextField 
              label="URL de Destino (POST)" 
              placeholder="https://seu-sistema.com/hook" 
              fullWidth size="small" 
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <Typography variant="caption" color="#aaa" display="block" mb={1}>EVENTOS INSCRITOS</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="device.online" size="small" onDelete={()=>{}} color="primary" variant="outlined" />
                <Chip label="device.offline" size="small" onDelete={()=>{}} color="primary" variant="outlined" />
                <Chip label="alarm.*" size="small" onDelete={()=>{}} color="error" variant="outlined" />
            </Box>
          </IntegrationCard>
        </Grid>

        {/* NOTIFICAÇÕES EXTERNAS */}
        <Grid item xs={12}>
          <IntegrationCard 
            title="Canais de Alerta" 
            description="Envie alarmes críticos para chats corporativos" 
            icon={<TelegramIcon />} 
            active={integrations.google}
            onToggle={() => toggle('google')}
          >
             <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Button fullWidth variant="outlined" startIcon={<img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" width="20"/>} sx={{color:'#fff', borderColor:'rgba(255,255,255,0.2)'}}>
                        Conectar Slack
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button fullWidth variant="outlined" startIcon={<img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Microsoft_Teams_icon.svg" width="20"/>} sx={{color:'#fff', borderColor:'rgba(255,255,255,0.2)'}}>
                        Conectar MS Teams
                    </Button>
                </Grid>
             </Grid>
          </IntegrationCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IntegrationsPage;