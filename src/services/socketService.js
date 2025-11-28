class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Set();
    this.reconnectInterval = 5000;
    this.url = 'wss://fleetvision.com.br/api/socket'; // Ajuste para wss:// se for HTTPS
  }

  connect(token) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

    // Traccar aceita token via query param para WebSockets
    const socketUrl = `${this.url}?token=${token}`;
    
    this.socket = new WebSocket(socketUrl);

    this.socket.onopen = () => {
      console.log('📡 [Socket] Conectado à telemetria em tempo real');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notify(data);
      } catch (err) {
        console.error('📡 [Socket] Erro ao processar mensagem:', err);
      }
    };

    this.socket.onclose = () => {
      console.warn('📡 [Socket] Desconectado. Tentando reconectar em 5s...');
      setTimeout(() => this.connect(token), this.reconnectInterval);
    };

    this.socket.onerror = (error) => {
      console.error('📡 [Socket] Erro:', error);
      this.socket.close();
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(data) {
    this.listeners.forEach((callback) => callback(data));
  }
}

export const socketService = new SocketService();