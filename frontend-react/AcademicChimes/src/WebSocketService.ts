import { Client, StompSubscription } from '@stomp/stompjs';

interface WebSocketMessage<T> {
  type: string;
  payload: T;
}

class WebSocketService {
  private client: Client;
  private connectPromise: Promise<void> | null = null;

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
    });

    this.client.onStompError = (frame) => {
      console.error('STOMP error', frame);
    };
  }

  connect(): Promise<void> {
    if (!this.connectPromise) {
      this.connectPromise = new Promise((resolve, reject) => {
        this.client.activate();
        this.client.onConnect = () => {
          console.log('Connected to WebSocket');
          resolve();
        };
        this.client.onStompError = (frame) => {
          console.error('STOMP error', frame);
          reject(new Error('Failed to connect to WebSocket'));
        };
        this.client.onWebSocketError = (event) => {
          console.error('WebSocket error', event);
          reject(new Error('WebSocket error'));
        };
      });
    }
    return this.connectPromise;
  }

  disconnect() {
    if (this.client.active) {
      this.client.deactivate();
    }
    this.connectPromise = null;
  }

  async subscribe<T>(destination: string, callback: (message: WebSocketMessage<T>) => void): Promise<StompSubscription | undefined> {
    try {
      await this.connect();
      return this.client.subscribe(destination, (message) => {
        const parsedMessage = JSON.parse(message.body) as WebSocketMessage<T>;
        callback(parsedMessage);
      });
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  }

  async send<T>(destination: string, message: WebSocketMessage<T>) {
    try {
      await this.connect();
      this.client.publish({
        destination,
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }
}

export default new WebSocketService();