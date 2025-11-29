import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI alternativa.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de relatórios de erro (ex: Sentry)
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
          height: '100vh', bgcolor: '#0f172a', color: '#fff', p: 3 
        }}>
          <Paper sx={{ 
            p: 4, maxWidth: 500, textAlign: 'center', 
            bgcolor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(10px)', 
            border: '1px solid rgba(255, 23, 68, 0.3)', borderRadius: 4 
          }}>
            <ErrorOutlineIcon sx={{ fontSize: 60, color: '#ff1744', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Ops! Algo deu errado.
            </Typography>
            <Typography variant="body2" sx={{ color: '#aaa', mb: 3 }}>
              Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada.
              Por favor, tente recarregar a página.
            </Typography>
            
            {/* Detalhes técnicos (Opcional - bom para dev, esconder em prod) */}
            {import.meta.env.DEV && this.state.error && (
              <Box sx={{ 
                mt: 2, mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.3)', borderRadius: 1, 
                textAlign: 'left', maxHeight: 150, overflow: 'auto', fontFamily: 'monospace', fontSize: '0.75rem' 
              }}>
                {this.state.error.toString()}
              </Box>
            )}

            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<RefreshIcon />}
              onClick={this.handleReload}
            >
              Recarregar Aplicação
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;