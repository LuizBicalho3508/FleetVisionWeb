import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useAppTheme = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children }) => {
  // Tenta ler do localStorage ou usa 'dark' como padrão
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'dark');

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: { main: mode === 'dark' ? '#00e5ff' : '#0066CC' },
        secondary: { main: mode === 'dark' ? '#7c4dff' : '#4A148C' },
        background: {
          default: mode === 'dark' ? '#0f172a' : '#f8f9fa',
          paper: mode === 'dark' ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
        },
        text: {
          primary: mode === 'dark' ? '#ffffff' : '#1a1a1a',
          secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        },
      },
      shape: { borderRadius: 8 },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 700 },
        h6: { fontWeight: 600 },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              background: mode === 'dark' 
                ? 'radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%) fixed'
                : '#f8f9fa',
              scrollbarWidth: 'thin',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backdropFilter: mode === 'dark' ? 'blur(12px)' : 'none',
              border: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
              boxShadow: mode === 'dark' ? 'none' : '0px 4px 20px rgba(0,0,0,0.05)',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: { textTransform: 'none', fontWeight: 600 },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};